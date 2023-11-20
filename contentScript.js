let isAudioPlaying = false;
let audioElement;

function canPlayRandomMusicToday(callback) {
  chrome.runtime.sendMessage({ action: 'canPlayRandomMusicToday' }, function(response) {
    callback(response.canPlay);
  });
}

function updateLastPlayDate() {
  const today = new Date().toLocaleDateString();
  chrome.storage.sync.set({ 'lastPlayDate': today });
}

function stopMusic() {
  if (isAudioPlaying && audioElement) {
    audioElement.pause();
    isAudioPlaying = false;
    console.log('Music stopped.');
  }
}

function playRandomMusic() {
  canPlayRandomMusicToday(function(canPlay) {
    if (canPlay) {
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
        console.log('Music started playing.');
        updateLastPlayDate();
      });
    } else {
      console.log('Music can only be played only once a day.');
    }
  });
}

function handleFirstClick() {
  playRandomMusic();
  document.removeEventListener('click', handleFirstClick);
}

document.addEventListener('click', handleFirstClick);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'stopMusic') {
    stopMusic();
  }
});

// Initial trigger function call
chrome.runtime.sendMessage({ action: 'triggerFunction' });
