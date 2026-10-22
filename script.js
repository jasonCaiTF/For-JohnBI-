
"use strict";

// ========================================
// FOR MY JOHNBI ❤️
// Video + 7 Voice Recordings + Background Music
// ========================================

// ELEMENTS
const openingScreen = document.getElementById("openingScreen");
const openButton = document.getElementById("openButton");

const video = document.getElementById("johnbiVideo");
const voice = document.getElementById("voiceAudio");
const music = document.getElementById("backgroundMusic");
const audioStatus = document.getElementById("audioStatus");

// ========================================
// VOICE RECORDINGS
// ========================================

const voiceFiles = [
  "给johnbi1.m4a",
  "给johnbi2.m4a",
  "给johnbi3.m4a",
  "给johnbi4.m4a",
  "给johnbi5.m4a",
  "给johnbi6.m4a",
  "给johnbi7.m4a"
];

let currentVoiceIndex = 0;
let allVoicesFinished = false;
let sequenceStarted = false;

// ========================================
// SETTINGS
// ========================================

// Video repeats every 26 seconds.
video.loop = true;

// Mute original video sound.
video.muted = true;

// Voice at full volume.
voice.volume = 1.0;

// Soft background music.
music.volume = 0.07;
music.loop = true;

// ========================================
// OPENING SCREEN
// ========================================

openButton.addEventListener("click", () => {
  openingScreen.classList.add("hidden");
});

// ========================================
// STATUS
// ========================================

function showStatus(message) {
  if (audioStatus) {
    audioStatus.textContent = message;
  }
}

function clearStatus() {
  showStatus("");
}

// ========================================
// LOAD RECORDING
// ========================================

function loadVoice(index) {
  if (index < 0 || index >= voiceFiles.length) {
    return false;
  }

  currentVoiceIndex = index;

  voice.src = "./" + voiceFiles[index];
  voice.load();

  return true;
}

// Prepare first recording.
loadVoice(0);

// ========================================
// PLAY AUDIO
// ========================================

function playVoice() {
  if (allVoicesFinished) return;

  voice.play().catch((error) => {
    console.error("Voice playback error:", error);

    if (!video.paused) {
      showStatus(
        "Voice recording could not start. Please check the audio file."
      );
    }
  });
}

function playMusic() {
  music.play().catch((error) => {
    console.error("Music playback error:", error);

    if (!video.paused) {
      showStatus(
        "Background music could not start."
      );
    }
  });
}

// ========================================
// START / RESUME
// ========================================

video.addEventListener("play", () => {

  clearStatus();

  // Restart sequence after all recordings
  // have finished.
  if (allVoicesFinished) {
    allVoicesFinished = false;
    sequenceStarted = false;
    loadVoice(0);
    music.currentTime = 0;
  }

  if (!sequenceStarted) {
    sequenceStarted = true;
  }

  playVoice();
  playMusic();

});

// ========================================
// PAUSE
// ========================================

video.addEventListener("pause", () => {
  voice.pause();
  music.pause();
});

// ========================================
// NEXT RECORDING
// ========================================

voice.addEventListener("ended", () => {

  // All seven recordings have finished.
  if (currentVoiceIndex === voiceFiles.length - 1) {

    allVoicesFinished = true;

    voice.pause();
    music.pause();
    video.pause();

    showStatus(
      "Seven little messages, just for you. ❤️"
    );

    return;
  }

  // Move to next recording.
  const nextIndex = currentVoiceIndex + 1;

  loadVoice(nextIndex);

  // Continue only while video is playing.
  if (!video.paused) {
    playVoice();
  }

});

// ========================================
// VIDEO ERROR
// ========================================

video.addEventListener("error", () => {
  showStatus(
    "Video could not load. Please check johnbi-video.mp4."
  );
});

// ========================================
// VOICE ERROR
// ========================================

voice.addEventListener("error", () => {
  showStatus(
    "Voice file could not load: " +
    voiceFiles[currentVoiceIndex]
  );
});

// ========================================
// MUSIC ERROR
// ========================================

music.addEventListener("error", () => {
  showStatus(
    "Background music could not load."
  );
});

// ========================================
// PAGE VISIBILITY
// ========================================

// Pause everything when user switches apps
// or locks their phone.

document.addEventListener("visibilitychange", () => {
  if (document.hidden && !video.paused) {
    video.pause();
  }
});

// ========================================
// READY
// ========================================

console.log("For My Johnbi ❤️ Ready");
