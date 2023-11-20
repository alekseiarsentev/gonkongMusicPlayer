chrome.runtime.onInstalled.addListener(function() {
  console.log('Gonkong anthems extension installed');
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'canPlayRandomMusicToday') {
    canPlayRandomMusicToday(function(canPlay) {
      sendResponse({ canPlay: canPlay });
    });
  } else if (request.action === 'updateLastPlayDate') {
    updateLastPlayDate();
  } else if (request.action === 'playRandomMusic') {
    // Forward the message to the active tab for music playback
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'playRandomMusic' });
    });
  }

  // Required for handling sendResponse in Manifest V3
  return true;
});

function canPlayRandomMusicToday(callback) {
  chrome.storage.sync.get(['lastPlayDate'], function(result) {
    const lastPlayDate = result.lastPlayDate;
    const today = new Date().toLocaleDateString();
    const canPlay = lastPlayDate !== today;
    callback(canPlay);
  });
}

function updateLastPlayDate() {
  const today = new Date().toLocaleDateString();
  chrome.storage.sync.set({ 'lastPlayDate': today });
}
