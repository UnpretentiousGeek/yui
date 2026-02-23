const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';

// ─── Shared fetch helper ──────────────────────────────────────────────────────

async function callClaude(systemPrompt, userMessage, apiKey) {
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
      system: systemPrompt,
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

// Strip markdown code fences if Claude adds them despite instructions
function parseJSON(text) {
  const cleaned = text.replace(/^```(?:json)?\s*/m, '').replace(/```\s*$/m, '').trim();
  return JSON.parse(cleaned);
}

// ─── Token extraction (Phase 3) ───────────────────────────────────────────────

const TOKEN_PROMPT = `You are a design system expert. Analyze the provided CSS data and extract the core design tokens.

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
  const parts = [`URL: ${rawCSS.url}`];

  if (Object.keys(rawCSS.cssVariables).length > 0) {
    parts.push('CSS Custom Properties:\n' + JSON.stringify(rawCSS.cssVariables, null, 2));
  }
  parts.push('Computed Styles:\n' + JSON.stringify(rawCSS.computedStyles, null, 2));

  return callClaude(TOKEN_PROMPT, parts.join('\n\n'), apiKey);
}

// ─── Structure analysis (Phase 4) ────────────────────────────────────────────

const STRUCTURE_PROMPT = `You are a CSS architecture expert. Analyze the provided CSS data and return a structural analysis of the website.

Return ONLY valid JSON matching this exact schema, with no explanation or markdown:
{
  "components": [],
  "layout": "",
  "cssArchitecture": "",
  "colorMode": "",
  "complexity": ""
}

Rules:
- components: array of UI component types detected — e.g. ["button", "card", "navbar", "modal", "form", "badge", "table", "input", "dropdown"]
- layout: primary layout method — "flexbox", "grid", "table", or "mixed"
- cssArchitecture: the CSS methodology detected from class naming patterns —
    "utility-first" (Tailwind-style: bg-blue-500, flex, mt-4),
    "BEM" (.block__element--modifier),
    "CSS-in-JS" (hashed class names like css-1a2b3c),
    "SMACSS" (.l-header, .is-active),
    "plain" (semantic selectors, no methodology),
    or "mixed"
- colorMode: how theming works —
    "light-only", "dark-only",
    "light-default" (has dark mode via class/media query),
    "dark-default" (has light mode via class/media query),
    or "system" (follows prefers-color-scheme only)
- complexity: overall CSS complexity — "simple", "moderate", or "complex"
- If a value cannot be determined, use null`;

/**
 * analyzeStructure — calls Claude with a raw CSS snapshot, returns structural analysis.
 * @param {object} rawCSS - output from extractCSS() in extract.js
 * @param {string} apiKey - Anthropic API key from chrome.storage
 * @returns {Promise<object>} structure analysis schema
 */
export async function analyzeStructure(rawCSS, apiKey) {
  const parts = [`URL: ${rawCSS.url}`];

  // Sample up to 200 rules — enough to detect naming patterns without blowing token budget
  if (rawCSS.stylesheetRules.length > 0) {
    const sample = rawCSS.stylesheetRules.slice(0, 200);
    parts.push(`CSS Rules (${rawCSS.stylesheetRules.length} total, showing first ${sample.length}):\n` + sample.join('\n'));
  }

  if (Object.keys(rawCSS.cssVariables).length > 0) {
    parts.push('CSS Custom Properties:\n' + JSON.stringify(rawCSS.cssVariables, null, 2));
  }

  return callClaude(STRUCTURE_PROMPT, parts.join('\n\n'), apiKey);
}
