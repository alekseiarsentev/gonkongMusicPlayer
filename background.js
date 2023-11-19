// background.js (service worker)
chrome.runtime.onInstalled.addListener(function() {
    console.log('Gonkong anthems extension installed');
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'playRandomMusic') {
      // Forward the message to the active tab for music playback
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'playRandomMusic' });
      });
    }
  });
  