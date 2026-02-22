// Relay extract requests from the popup to the active tab's content script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'extract') {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, { action: 'extract' }, (response) => {
        sendResponse(response);
      });
    });
    return true; // async — keep message channel open
  }
});
