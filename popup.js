// popup.js
document.addEventListener('DOMContentLoaded', function () {
  // Add a click event listener to the "Stop Music" button
  document.getElementById('stopMusicButton').addEventListener('click', function () {
    // Send a message to the content script to stop the music
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'stopMusic' });
    });
  });
});
