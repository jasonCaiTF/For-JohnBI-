
"use strict";

// ========================================
// FOR MY JOHNBI - AUDIO & VIDEO CONTROLLER
// ========================================

// HTML Elements
const openingScreen = document.getElementById("openingScreen");
const openButton = document.getElementById("openButton");

const video = document.getElementById("johnbiVideo");
const voice = document.getElementById("voiceAudio");
const music = document.getElementById("backgroundMusic");
const audioStatus = document.getElementById("audioStatus");

// ========================================
// SEVEN VOICE RECORDINGS
// ========================================

// IMPORTANT:
// File names must match GitHub exactly.

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
let switchingVoice = false;

// ========================================
// BASIC SETTINGS
// ========================================

voice.volume = 1.0;
music.volume = 0.07;
music.loop = true;

// Prevent the video's original sound
// from interfering with the recordings.
video.muted = true;

// ========================================
// OPENING SCREEN
// ========================================

openButton.addEventListener("click", () => {
  openingScreen.classList.add("hidden");
});

// ========================================
// STATUS MESSAGE
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
// LOAD A VOICE RECORDING
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

// Prepare the first recording.
loadVoice(0);

// ========================================
// PLAY AUDIO
// ========================================

function playVoice() {
  if (allVoicesFinished || switchingVoice) {
    return;
  }

  const promise = voice.play();

  if (promise !== undefined) {
    promise.catch((error) => {
      if (!video.paused && !video.ended) {
        console.error("Voice playback error:", error);

        showStatus(
          "Voice recording could not start. Please check the audio file."
        );
      }
    });
  }
}

function playMusic() {
  const promise = music.play();

  if (promise !== undefined) {
    promise.catch((error) => {
      if (!video.paused && !video.ended) {
        console.error("Music playback error:", error);

        showStatus(
          "Background music could not start."
        );
      }
    });
  }
}

// ========================================
// VIDEO STARTS
// ========================================

video.addEventListener("play", () => {
  clearStatus();

  // Restart the voice sequence after
  // the video has finished previously.
  if (allVoicesFinished && video.currentTime === 0) {
    allVoicesFinished = false;
    loadVoice(0);
  }

  playVoice();
  playMusic();
});

// ========================================
// VIDEO PAUSES
// ========================================

video.addEventListener("pause", () => {
  voice.pause();
  music.pause();
});

// ========================================
// NEXT VOICE RECORDING
// ========================================

voice.addEventListener("ended", () => {
  if (currentVoiceIndex >= voiceFiles.length - 1) {
    allVoicesFinished = true;
    return;
  }

  switchingVoice = true;

  const nextIndex = currentVoiceIndex + 1;

  loadVoice(nextIndex);

  switchingVoice = false;

  // Continue only while video is playing.
  if (!video.paused && !video.ended) {
    playVoice();
  }
});

// ========================================
// VIDEO ENDS
// ========================================

video.addEventListener("ended", () => {
  voice.pause();
  music.pause();

  // Reset audio for the next viewing.
  allVoicesFinished = false;
  currentVoiceIndex = 0;

  music.currentTime = 0;
  loadVoice(0);

  clearStatus();
});

// ========================================
// VIDEO ERRORS
// ========================================

video.addEventListener("error", () => {
  showStatus(
    "Video could not load. Please check johnbi-video.mp4."
  );
});

// ========================================
// AUDIO ERRORS
// ========================================

voice.addEventListener("error", () => {
  if (voice.src) {
    showStatus(
      "Voice file could not load: " +
      voiceFiles[currentVoiceIndex]
    );
  }
});

music.addEventListener("error", () => {
  showStatus(
    "Background music file could not load."
  );
});

// ========================================
// PAGE VISIBILITY
// ========================================

// Pause video when user switches apps
// or locks the phone.

document.addEventListener("visibilitychange", () => {
  if (document.hidden && !video.paused) {
    video.pause();
  }
});

// ========================================
// INITIALIZATION COMPLETE
// ========================================

console.log("For My Johnbi - Ready ♡");
