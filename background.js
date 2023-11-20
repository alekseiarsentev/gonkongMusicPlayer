// background.js

chrome.runtime.onInstalled.addListener(function() {
  console.log('Gonkong anthems extension installed');
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'canCallFunctionToday') {
    canCallFunctionToday(function (canCall) {
      sendResponse({ canCall: canCall });
    });
  } else if (request.action === 'updateLastCallDate') {
    updateLastCallDate();
  } else if (request.action === 'playRandomMusic') {
    // Forward the message to the active tab for music playback
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'playRandomMusic' });
    });
  }

  // Required for handling sendResponse in Manifest V3
  return true;
});

function canCallFunctionToday(callback) {
  chrome.storage.sync.get(['lastCallDate'], function (result) {
    const lastCallDate = result.lastCallDate;
    const today = new Date().toLocaleDateString();
    const canCall = lastCallDate !== today;
    callback(canCall);
  });
}

function updateLastCallDate() {
  const today = new Date().toLocaleDateString();
  chrome.storage.sync.set({ 'lastCallDate': today });
}
