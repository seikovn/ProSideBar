// background.js - service worker
chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg && msg.type === 'captureVisibleTab') {
    chrome.tabs.captureVisibleTab({ format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        respond({ success: false, error: chrome.runtime.lastError.message });
      } else {
        respond({ success: true, dataUrl });
      }
    });
    return true; // async respond
  }

  if (msg && msg.type === 'openOptions') {
    chrome.runtime.openOptionsPage();
    respond({ success: true });
    return;
  }
});
