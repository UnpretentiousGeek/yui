/**
 * extractCSS — runs in content script context.
 * Returns a structured snapshot of the page's raw CSS for Claude to analyze.
 */
export function extractCSS() {
  const result = {
    url: location.href,
    title: document.title,
    stylesheetRules: [],
    cssVariables: {},
    computedStyles: {},
  };

  // 1. Collect stylesheet rules (skip cross-origin sheets)
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        result.stylesheetRules.push(rule.cssText);
      }
    } catch {
      // Cross-origin stylesheet — inaccessible due to CORS, skip silently
    }
  }

  // 2. Collect CSS custom properties declared on :root
  const rootStyle = getComputedStyle(document.documentElement);
  for (const prop of rootStyle) {
    if (prop.startsWith('--')) {
      result.cssVariables[prop] = rootStyle.getPropertyValue(prop).trim();
    }
  }

  // 3. Sample computed styles from key semantic elements
  const targets = {
    body: document.body,
    h1: document.querySelector('h1'),
    h2: document.querySelector('h2'),
    h3: document.querySelector('h3'),
    p: document.querySelector('p'),
    a: document.querySelector('a'),
    button: document.querySelector('button'),
    input: document.querySelector('input'),
  };

  const propsToCapture = [
    'color',
    'background-color',
    'font-family',
    'font-size',
    'font-weight',
    'line-height',
    'letter-spacing',
    'border-radius',
    'box-shadow',
    'padding',
    'margin',
    'border-color',
    'border-width',
    'border-style',
    'text-decoration',
    'opacity',
  ];

  for (const [name, el] of Object.entries(targets)) {
    if (!el) continue;
    const computed = getComputedStyle(el);
    result.computedStyles[name] = {};
    for (const prop of propsToCapture) {
      result.computedStyles[name][prop] = computed.getPropertyValue(prop);
    }
  }

  return result;
}
