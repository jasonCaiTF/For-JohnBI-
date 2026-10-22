
"use strict";

// ===============================
// ELEMENTS
// ===============================

const video = document.getElementById("johnbiVideo");
const voice = document.getElementById("voiceAudio");
const music = document.getElementById("backgroundMusic");
const statusText = document.getElementById("audioStatus");

// ===============================
// SEVEN VOICE RECORDINGS
// ===============================

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
let finished = false;
let session = 0;

// ===============================
// AUDIO SETTINGS
// ===============================

// Clear voice
voice.volume = 1.0;

// Very soft background music
music.volume = 0.07;

// Video has no separate sound.
// Remove this line if you want its original audio.
video.muted = true;

// ===============================
// HELPERS
// ===============================

function updateStatus(message) {
  if (statusText) {
    statusText.textContent = message;
  }
}

function loadVoice(index) {
  if (index < 0 || index >= voiceFiles.length) {
    return;
  }

  currentVoiceIndex = index;
  voice.src = voiceFiles[index];
  voice.load();

  updateStatus(
    `Voice message ${index + 1} of ${voiceFiles.length} ♡`
  );
}

function tryPlay(element, label) {
  const result = element.play();

  if (result && typeof result.catch === "function") {
    result.catch(error => {
      console.warn(label + " playback error:", error);

      if (!video.paused) {
        updateStatus(
          "Audio could not start. Please tap pause and play again."
        );
      }
    });
  }
}

// ===============================
// INITIALIZE
// ===============================

loadVoice(0);

updateStatus("Seven little messages, just for you.");

// ===============================
// VIDEO PLAY
// ===============================

video.addEventListener("play", () => {

  if (finished) {
    finished = false;
    session++;
    loadVoice(0);
    music.currentTime = 0;
  }

  // Start both tracks immediately from
  // the user's video-play interaction.
  tryPlay(voice, "Voice");
  tryPlay(music, "Music");

});

// ===============================
// VIDEO PAUSE
// ===============================

video.addEventListener("pause", () => {
  voice.pause();
  music.pause();
});

// ===============================
// NEXT VOICE RECORDING
// ===============================

voice.addEventListener("ended", () => {

  if (finished) return;

  const nextIndex = currentVoiceIndex + 1;

  if (nextIndex < voiceFiles.length) {

    loadVoice(nextIndex);

    if (!video.paused) {
      tryPlay(voice, "Next voice");
    }

  } else {

    // All seven recordings have finished.
    finished = true;
    session++;

    voice.pause();
    music.pause();
    video.pause();

    updateStatus(
      "All seven messages have finished. ♡"
    );

  }

});

// ===============================
// VIDEO LOOPING
// ===============================

// The HTML video has the loop attribute.
// If the video is shorter than all seven
// recordings, it repeats without interrupting
// the voice or background music.

// ===============================
// AUDIO ERRORS
// ===============================

voice.addEventListener("error", () => {
  updateStatus(
    "A recording could not load. Please check its filename."
  );
});

music.addEventListener("error", () => {
  console.warn(
    "Background music could not load. Check background-music.mp3"
  );
});

// ===============================
// PAGE VISIBILITY
// ===============================

// Pause everything if the visitor
// switches apps or locks the phone.

document.addEventListener("visibilitychange", () => {
  if (document.hidden && !video.paused) {
    video.pause();
  }
});
