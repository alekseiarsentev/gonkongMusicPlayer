// contentScript.js

function triggerFunction() {
  chrome.runtime.sendMessage({ action: "canCallFunctionToday" }, function(response) {
    if (response.canCall) {
      alert('Function called!');
      chrome.runtime.sendMessage({ action: "updateLastCallDate" });
    } else {
      alert('Function can only be called once a day.');
    }
  });
}

triggerFunction();

let isAudioPlaying = false;
let audioElement;

function playRandomMusic() {
  if (isAudioPlaying) {
    return;
  }

  audioElement = new Audio();
  const mp3Files = [
    "assets/TheHeroStory.mp3",
    "assets/MidnightRider.mp3"
  ];
  const randomIndex = Math.floor(Math.random() * mp3Files.length);
  const randomMp3File = mp3Files[randomIndex];
  audioElement.src = chrome.runtime.getURL(randomMp3File);
  audioElement.play().then(() => {
    isAudioPlaying = true;
  });
}

function stopMusic() {
  if (isAudioPlaying && audioElement) {
    audioElement.pause();
    isAudioPlaying = false;
  }
}

function handleFirstClick() {
  playRandomMusic();
  document.removeEventListener('click', handleFirstClick);
}

document.addEventListener('click', handleFirstClick);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'stopMusic') {
    stopMusic();
  }
});
