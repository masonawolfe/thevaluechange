// Netlify Function: Generate AI company profile via Claude API
// POST /.netlify/functions/generate-profile { query: "Kraft Heinz" }

const COMPANY_SCHEMA_EXAMPLE = `{
  "name": "Company Name",
  "ticker": "TICK",
  "sector": "Category",
  "vci": 75,
  "sc": 70,
  "iv": 68,
  "dm": 72,
  "earnings": false,
  "headline": "One-line lead story for this week",
  "deck": "1-2 sentence strategic summary",
  "execSummary": "200-300 word executive overview of the company's current strategic position, covering key moves, market dynamics, and competitive landscape.",
  "ourRead": "2-3 sentence analyst take — opinionated, not neutral",
  "bottomLine": "1-2 sentence strategic implication for CPG professionals",
  "lastUpdated": "${new Date().toISOString().split('T')[0]}",
  "mgmtSignals": [
    { "q": "Exact or paraphrased quote", "speaker": "CEO Name", "title": "Chief Executive Officer", "source": "Q4 2025 Earnings Call" },
    { "q": "Another signal", "speaker": "CFO Name", "title": "Chief Financial Officer", "source": "Investor Day 2025" }
  ],
  "risks": ["Risk 1 — 1-2 sentences", "Risk 2", "Risk 3", "Risk 4"],
  "opps": [
    { "title": "Opportunity headline", "detail": "Why this matters and the timeline — 2-3 sentences" },
    { "title": "Second opp", "detail": "Detail" },
    { "title": "Third opp", "detail": "Detail" },
    { "title": "Fourth opp", "detail": "Detail" }
  ],
  "radar": {
    "Strategy Clarity": 70,
    "Innovation Velocity": 68,
    "Supply Chain Resilience": 72,
    "Mfg Efficiency": 74,
    "Marketing Modernization": 70,
    "Digital & AI": 66,
    "Financial Flexibility": 60,
    "Org Agility": 62,
    "Competitive Position": 71
  },
  "vc": {
    "Supply Chain": { "summary": "One-liner", "str": ["Strength 1"], "wk": ["Weakness 1"], "signals": ["Recent signal"], "outlook": "6-12 month prognosis" },
    "Research & Dev": { "summary": "", "str": [], "wk": [], "signals": [], "outlook": "" },
    "Manufacturing": { "summary": "", "str": [], "wk": [], "signals": [], "outlook": "" },
    "Digital & AI": { "summary": "", "str": [], "wk": [], "signals": [], "outlook": "" },
    "Marketing & Brand": { "summary": "", "str": [], "wk": [], "signals": [], "outlook": "" }
  },
  "news": []
}`;

exports.handler = async (event) => {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  let query;
  try {
    const body = JSON.parse(event.body);
    query = (body.query || '').trim();
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  // Validate input
  if (!query || query.length < 2 || query.length > 100) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Query must be 2-100 characters' }) };
  }

  // Sanitize: allow only reasonable company name characters
  const sanitized = query.replace(/[^a-zA-Z0-9\s&\-.']/g, '').trim();
  if (!sanitized) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid query' }) };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: `You are a CPG (consumer packaged goods) strategy analyst generating company intelligence profiles. You write with authority — like a seasoned analyst at a top consulting firm writing for smart CPG professionals.

Your output MUST be valid JSON matching this exact schema:
${COMPANY_SCHEMA_EXAMPLE}

Rules:
- Use real, publicly available information. Be honest and analytical, not promotional.
- Score VCI/SC/IV/DM on 0-100 scale. Be conservative — only best-in-class companies score 85+.
- Radar scores should be 0-100, reflecting genuine competitive assessment.
- Include 2-3 real management quotes if you know them. If uncertain, write realistic paraphrases and note the source as "Attributed".
- Include exactly 4 risks (real strategic concerns) and 4 opportunities.
- Include exactly 5 value chain sections with keys: "Supply Chain", "Research & Dev", "Manufacturing", "Digital & AI", "Marketing & Brand". Each with 2-3 strengths, 2-3 weaknesses, 1-2 signals, and an outlook.
- Leave news as an empty array.
- Set earnings to false.
- If the company is NOT a CPG/consumer goods company, return: {"error": "not_cpg", "message": "Company description"}
- Return ONLY the JSON object, no markdown, no explanation.`,
        messages: [{
          role: 'user',
          content: `Generate a CPG strategy intelligence profile for: ${sanitized}`
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Claude API error:', response.status, errText);
      return {
        statusCode: response.status === 429 ? 429 : 502,
        body: JSON.stringify({ error: response.status === 429 ? 'Rate limited — try again in a minute' : 'AI service error' })
      };
    }

    const result = await response.json();
    const text = result.content[0].text;

    // Parse the JSON response
    let profile;
    try {
      profile = JSON.parse(text);
    } catch {
      // Try extracting JSON from potential markdown wrapping
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        profile = JSON.parse(jsonMatch[0]);
      } else {
        return { statusCode: 502, body: JSON.stringify({ error: 'Failed to parse AI response' }) };
      }
    }

    // Check if it's a not-CPG error
    if (profile.error === 'not_cpg') {
      return { statusCode: 422, body: JSON.stringify(profile) };
    }

    // Add generation metadata
    profile._meta = {
      generated: true,
      generatedAt: new Date().toISOString(),
      model: 'claude-sonnet-4-20250514',
      query: sanitized
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    };

  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
