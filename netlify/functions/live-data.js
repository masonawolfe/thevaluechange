// Netlify Function: Fetch live data from free public APIs
// GET /.netlify/functions/live-data?type=earnings&ticker=PEP
// GET /.netlify/functions/live-data?type=filings&ticker=PEP
// GET /.netlify/functions/live-data?type=price&ticker=PEP

// SEC EDGAR CIK mappings for covered companies
const CIK_MAP = {
  PG: '0000080424', UL: '0000110876', MNST: '0000865752',
  PEP: '0000077476', KO: '0000021344', GIS: '0000040704',
  KMB: '0000055785', CL: '0000021665', MDLZ: '0000001103',
  NSRGY: null // Nestlé is Swiss, not in EDGAR
};

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

exports.handler = async (event) => {
  const { type, ticker } = event.queryStringParameters || {};

  if (!type || !ticker) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Missing type or ticker param' }) };
  }

  const t = ticker.toUpperCase();

  try {
    if (type === 'filings') {
      return await getFilings(t);
    } else if (type === 'price') {
      return await getPrice(t);
    } else if (type === 'earnings') {
      return await getEarnings(t);
    } else if (type === 'news') {
      return await getNews(t);
    } else if (type === 'fundamentals') {
      return await getFundamentals(t);
    } else if (type === 'transcripts') {
      return await getTranscriptQuotes(event.queryStringParameters);
    } else {
      return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Unknown type. Use: filings, price, earnings, news, fundamentals, transcripts' }) };
    }
  } catch (err) {
    console.error('live-data error:', err);
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: 'Internal error' }) };
  }
};

// SEC EDGAR: Recent filings (free, no API key)
async function getFilings(ticker) {
  const cik = CIK_MAP[ticker];
  if (!cik) {
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ticker, filings: [], note: 'No EDGAR data for this ticker' }) };
  }

  const res = await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, {
    headers: { 'User-Agent': 'TheValueChange/1.0 (masonawolfe@gmail.com)' }
  });

  if (!res.ok) {
    return { statusCode: 502, headers: HEADERS, body: JSON.stringify({ error: 'SEC EDGAR unavailable' }) };
  }

  const data = await res.json();
  const recent = data.filings?.recent || {};
  const filings = [];

  for (let i = 0; i < Math.min(10, (recent.form || []).length); i++) {
    filings.push({
      form: recent.form[i],
      date: recent.filingDate[i],
      description: recent.primaryDocDescription?.[i] || '',
      accession: recent.accessionNumber[i]
    });
  }

  return {
    statusCode: 200,
    headers: HEADERS,
    body: JSON.stringify({
      ticker,
      name: data.name,
      cik: data.cik,
      filings
    })
  };
}

// Stock price via Alpha Vantage (free tier, 25/day)
async function getPrice(ticker) {
  const apiKey = process.env.ALPHA_VANTAGE_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ticker, price: null, note: 'ALPHA_VANTAGE_KEY not configured' }) };
  }

  const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`);
  const data = await res.json();
  const quote = data['Global Quote'] || {};

  return {
    statusCode: 200,
    headers: HEADERS,
    body: JSON.stringify({
      ticker,
      price: quote['05. price'] || null,
      change: quote['09. change'] || null,
      changePercent: quote['10. change percent'] || null,
      volume: quote['06. volume'] || null,
      latestDay: quote['07. latest trading day'] || null
    })
  };
}

// Earnings dates via Financial Modeling Prep (free tier, 250/day)
async function getEarnings(ticker) {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ticker, earnings: [], note: 'FMP_API_KEY not configured' }) };
  }

  const res = await fetch(`https://financialmodelingprep.com/api/v3/earning_calendar?symbol=${ticker}&apikey=${apiKey}`);
  const data = await res.json();

  const earnings = (data || []).slice(0, 4).map(e => ({
    date: e.date,
    epsEstimate: e.epsEstimated,
    epsActual: e.eps,
    revEstimate: e.revenueEstimated,
    revActual: e.revenue,
    time: e.time === 'bmo' ? 'BMO' : e.time === 'amc' ? 'AMC' : e.time
  }));

  return {
    statusCode: 200,
    headers: HEADERS,
    body: JSON.stringify({ ticker, earnings })
  };
}

// Company news via Finnhub (free tier, 60/min)
async function getNews(ticker) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ticker, news: [], note: 'FINNHUB_API_KEY not configured' }) };
  }

  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const res = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${to}&token=${apiKey}`);
  const data = await res.json();

  const news = (data || []).slice(0, 10).map(n => ({
    title: n.headline,
    source: n.source,
    date: new Date(n.datetime * 1000).toISOString().slice(0, 10),
    url: n.url,
    summary: n.summary?.slice(0, 200),
    category: n.category
  }));

  return {
    statusCode: 200,
    headers: HEADERS,
    body: JSON.stringify({ ticker, news, period: `${from} to ${to}` })
  };
}

// Company fundamentals via FMP (free tier, 250/day)
async function getFundamentals(ticker) {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ticker, fundamentals: null, note: 'FMP_API_KEY not configured' }) };
  }

  // Fetch profile + key metrics in parallel
  const [profileRes, metricsRes] = await Promise.all([
    fetch(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${apiKey}`),
    fetch(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${ticker}?apikey=${apiKey}`)
  ]);

  const profile = (await profileRes.json())?.[0] || {};
  const metrics = (await metricsRes.json())?.[0] || {};

  return {
    statusCode: 200,
    headers: HEADERS,
    body: JSON.stringify({
      ticker,
      fundamentals: {
        marketCap: profile.mktCap,
        price: profile.price,
        beta: profile.beta,
        sector: profile.sector,
        industry: profile.industry,
        employees: profile.fullTimeEmployees,
        peRatio: metrics.peRatioTTM,
        evToEbitda: metrics.enterpriseValueOverEBITDATTM,
        revenuePerShare: metrics.revenuePerShareTTM,
        netIncomePerShare: metrics.netIncomePerShareTTM,
        dividendYield: metrics.dividendYieldTTM,
        roeTTM: metrics.roeTTM,
        debtToEquity: metrics.debtToEquityTTM
      }
    })
  };
}

// Cross-company transcript query (reads from data.json transcriptQuotes)
// GET /.netlify/functions/live-data?type=transcripts&topic=pricing&ticker=ALL
async function getTranscriptQuotes(params) {
  const { topic, ticker: filterTicker } = params;

  // Read data.json from the deploy bundle
  const fs = require('fs');
  const path = require('path');
  let dataJson;
  try {
    const dataPath = path.join(__dirname, '..', '..', 'data.json');
    dataJson = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ quotes: [], note: 'No transcript data available yet' }) };
  }

  let quotes = dataJson.transcriptQuotes || [];

  // Filter by topic
  if (topic && topic !== 'ALL') {
    quotes = quotes.filter(q => q.topics && q.topics.includes(topic.toLowerCase()));
  }

  // Filter by ticker
  if (filterTicker && filterTicker !== 'ALL') {
    quotes = quotes.filter(q => q.ticker === filterTicker.toUpperCase());
  }

  // Group by topic for summary
  const topicCounts = {};
  quotes.forEach(q => {
    (q.topics || []).forEach(t => { topicCounts[t] = (topicCounts[t] || 0) + 1; });
  });

  // Group by ticker for cross-company view
  const byTicker = {};
  quotes.forEach(q => {
    if (!byTicker[q.ticker]) byTicker[q.ticker] = [];
    byTicker[q.ticker].push(q);
  });

  return {
    statusCode: 200,
    headers: HEADERS,
    body: JSON.stringify({
      total: quotes.length,
      topicCounts,
      byTicker: Object.fromEntries(Object.entries(byTicker).map(([k, v]) => [k, v.length])),
      quotes: quotes.slice(0, 50) // Limit response size
    })
  };
}
