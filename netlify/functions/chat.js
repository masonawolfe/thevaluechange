// Netlify Function: AI chat for company analysis
// POST /.netlify/functions/chat { question, ticker, context }

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'POST only' }) };
  }

  const apiKey = process.env.CLAUDE_API_KEY || process.env.Anthropic_API_Key || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { question, ticker, context } = body;
  if (!question || !context) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing question or context' }) };
  }

  const systemPrompt = `You are the AI analyst for The Value Change, a CPG strategy intelligence platform. You answer questions about consumer packaged goods companies with the authority of a seasoned industry analyst.

Your tone: authoritative but accessible. Use concrete numbers and examples. Frame challenges as industry patterns, not company failures. End with actionable insight.

Keep responses concise — 2-4 short paragraphs max. Use **bold** for emphasis. Do not use markdown headers.

You have access to the following company data for ${ticker}:
${context}

Answer based on this data. If asked about something not in the data, say so briefly and offer what you can answer.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: question }]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 429) return { statusCode: 429, body: JSON.stringify({ error: 'Rate limited — try again in a moment' }) };
      return { statusCode: res.status, body: JSON.stringify({ error: err.error?.message || 'API error' }) };
    }

    const data = await res.json();
    const answer = data.content?.[0]?.text || 'No response generated.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ answer })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Connection failed' }) };
  }
};
