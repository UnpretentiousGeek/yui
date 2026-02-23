import { extractTokens, analyzeStructure } from '../lib/claude.js';
import { getApiKey, saveDesign, saveStructure, setApiKey } from '../lib/storage.js';

// Seed API key from .env.local at dev time — no-op in production if var is unset
const ENV_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
if (ENV_API_KEY) setApiKey(ENV_API_KEY);

function extractCSSFromTab(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { action: 'extract' }, (response) => {
      if (chrome.runtime.lastError) {
        resolve({ ok: false, error: chrome.runtime.lastError.message });
        return;
      }
      resolve(response);
    });
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'extract') {
    if (!message.tabId) {
      sendResponse({ ok: false, error: 'Missing tabId' });
      return true;
    }
    extractCSSFromTab(message.tabId).then(sendResponse);
    return true;
  }

  if (message.action === 'extractTokens') {
    (async () => {
      try {
        if (!message.tabId) { sendResponse({ ok: false, error: 'Missing tabId' }); return; }
        const apiKey = await getApiKey();
        if (!apiKey) { sendResponse({ ok: false, error: 'No API key set' }); return; }

        const cssResponse = await extractCSSFromTab(message.tabId);
        if (!cssResponse?.ok) {
          sendResponse({ ok: false, error: cssResponse?.error ?? 'CSS extraction failed — refresh the tab and try again' });
          return;
        }

        const tokens = await extractTokens(cssResponse.data, apiKey);
        await saveDesign(cssResponse.data.url, tokens);
        sendResponse({ ok: true, data: tokens });
      } catch (err) {
        sendResponse({ ok: false, error: err.message });
      }
    })();
    return true;
  }

  if (message.action === 'analyzeStructure') {
    (async () => {
      try {
        if (!message.tabId) { sendResponse({ ok: false, error: 'Missing tabId' }); return; }
        const apiKey = await getApiKey();
        if (!apiKey) { sendResponse({ ok: false, error: 'No API key set' }); return; }

        const cssResponse = await extractCSSFromTab(message.tabId);
        if (!cssResponse?.ok) {
          sendResponse({ ok: false, error: cssResponse?.error ?? 'CSS extraction failed — refresh the tab and try again' });
          return;
        }

        const structure = await analyzeStructure(cssResponse.data, apiKey);
        await saveStructure(cssResponse.data.url, structure);
        sendResponse({ ok: true, data: structure });
      } catch (err) {
        sendResponse({ ok: false, error: err.message });
      }
    })();
    return true;
  }
});
