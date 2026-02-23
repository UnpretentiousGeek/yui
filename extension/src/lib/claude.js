const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `You are a design system expert. Analyze the provided CSS data and extract the core design tokens.

Return ONLY valid JSON matching this exact schema, with no explanation or markdown:
{
  "colors": {
    "primary": "",
    "background": "",
    "surface": "",
    "text": "",
    "border": ""
  },
  "typography": {
    "fontFamily": "",
    "fontSize": "",
    "fontWeight": "",
    "lineHeight": ""
  },
  "radius": "",
  "shadow": "",
  "spacing": ""
}

Rules:
- Use actual CSS values (hex, rgb, rem, px, etc.)
- primary: the main brand/accent color used for buttons and links
- background: the page background color
- surface: card/panel background color (use background value if no distinct surface exists)
- text: the main body text color
- border: the default border/divider color
- typography fields describe body/paragraph text
- radius: the most common border-radius value
- shadow: the most common box-shadow value
- spacing: the base spacing unit (e.g. 4px, 8px, 1rem)
- If a value cannot be determined, use null`;

/**
 * extractTokens — calls Claude with a raw CSS snapshot, returns structured design tokens.
 * @param {object} rawCSS - output from extractCSS() in extract.js
 * @param {string} apiKey - Anthropic API key from chrome.storage
 * @returns {Promise<object>} design token schema
 */
export async function extractTokens(rawCSS, apiKey) {
  const userMessage = buildMessage(rawCSS);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message ?? `Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return parseJSON(data.content[0].text);
}

function buildMessage(rawCSS) {
  const parts = [`URL: ${rawCSS.url}`];

  if (Object.keys(rawCSS.cssVariables).length > 0) {
    parts.push('CSS Custom Properties:\n' + JSON.stringify(rawCSS.cssVariables, null, 2));
  }

  parts.push('Computed Styles:\n' + JSON.stringify(rawCSS.computedStyles, null, 2));

  return parts.join('\n\n');
}

// Strip markdown code fences if Claude adds them despite instructions
function parseJSON(text) {
  const cleaned = text.replace(/^```(?:json)?\s*/m, '').replace(/```\s*$/m, '').trim();
  return JSON.parse(cleaned);
}
