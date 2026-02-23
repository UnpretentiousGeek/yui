const KEYS = {
  API_KEY: 'apiKey',
  DESIGNS: 'designs',
};

export async function getApiKey() {
  const result = await chrome.storage.local.get(KEYS.API_KEY);
  return result[KEYS.API_KEY] ?? null;
}

export async function setApiKey(key) {
  await chrome.storage.local.set({ [KEYS.API_KEY]: key });
}

export async function saveDesign(url, tokens) {
  const result = await chrome.storage.local.get(KEYS.DESIGNS);
  const designs = result[KEYS.DESIGNS] ?? {};
  designs[url] = { tokens, savedAt: Date.now() };
  await chrome.storage.local.set({ [KEYS.DESIGNS]: designs });
}

export async function getDesign(url) {
  const result = await chrome.storage.local.get(KEYS.DESIGNS);
  const designs = result[KEYS.DESIGNS] ?? {};
  return designs[url] ?? null;
}

export async function listDesigns() {
  const result = await chrome.storage.local.get(KEYS.DESIGNS);
  return result[KEYS.DESIGNS] ?? {};
}
