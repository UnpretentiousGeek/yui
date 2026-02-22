import { extractCSS } from '../lib/extract.js';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'extract') {
    sendResponse({ ok: true, data: extractCSS() });
  }
  return true; // keep channel open for async responses
});
