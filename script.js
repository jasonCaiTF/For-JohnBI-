
"use strict";

// =====================================
// FOR MY JOHNBI ❤️
// Video + 7 Recordings + Background Music
// =====================================

const openingScreen =
  document.getElementById("openingScreen");

const video =
  document.getElementById("johnbiVideo");

const voice =
  document.getElementById("voiceAudio");

const music =
  document.getElementById("backgroundMusic");

const startButton =
  document.getElementById("startButton");

const audioStatus =
  document.getElementById("audioStatus");

// =====================================
// SEVEN RECORDINGS
// =====================================

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
let sequenceFinished = false;
let sequenceStarted = false;
let audioUnlocked = false;

// Prevent old play requests from
// interfering with a newer playback.
let playGeneration = 0;

// =====================================
// AUDIO SETTINGS
// =====================================

// Repeat the 26-second video.
video.loop = true;

// Avoid overlapping original video sound.
video.muted = true;

// Recording volume.
voice.volume = 1.0;

// Background music: 7%.
music.volume = 0.07;
music.loop = true;

// =====================================
// STATUS MESSAGE
// =====================================

function showStatus(message) {
  if (audioStatus) {
    audioStatus.textContent = message;
  }
}

function clearStatus() {
  showStatus("");
}

// =====================================
// OPENING SCREEN
// =====================================

const openButton =
  document.getElementById("openButton");

openButton.addEventListener("click", () => {
  openingScreen.classList.add("hidden");
});

// =====================================
// LOAD VOICE
// =====================================

function loadVoice(index) {
  if (index < 0 || index >= voiceFiles.length) {
    return false;
  }

  currentVoiceIndex = index;

  voice.src = "./" + voiceFiles[index];
  voice.load();

  return true;
}

// Load first recording.
loadVoice(0);

// =====================================
// HANDLE PLAYBACK ERRORS
// =====================================

function handlePlayError(error, name, generation) {
  if (generation !== playGeneration) {
    return;
  }

  if (error.name === "AbortError") {
    return;
  }

  console.error(name + " playback error:", error);

  showStatus(
    name + " could not start. " +
    "Please check the file or tap " +
    "Start our memories ♡ again."
  );
}

// =====================================
// START AUDIO
// =====================================

function startAudio() {
  if (sequenceFinished) {
    return;
  }

  const generation = ++playGeneration;

  // Call both play() methods immediately.
  // This helps mobile browser compatibility.

  if (!voice.ended) {
    const voicePromise = voice.play();

    if (voicePromise) {
      voicePromise.catch(error => {
        handlePlayError(
          error,
          "Voice recording",
          generation
        );
      });
    }
  }

  const musicPromise = music.play();

  if (musicPromise) {
    musicPromise.catch(error => {
      handlePlayError(
        error,
        "Background music",
        generation
      );
    });
  }
}

// =====================================
// START BUTTON
// =====================================

startButton.addEventListener("click", () => {
  clearStatus();

  // Restart everything if all
  // seven recordings have finished.
  if (sequenceFinished) {
    resetSequence();
  }

  // This click is a direct user gesture.
  // Start all media without waiting for
  // another asynchronous operation.

  audioUnlocked = true;
  sequenceStarted = true;

  startAudio();

  const videoPromise = video.play();

  if (videoPromise) {
    videoPromise.catch(error => {
      console.error("Video error:", error);

      voice.pause();
      music.pause();

      showStatus(
        "Video could not start. " +
        "Please check johnbi-video.mp4."
      );
    });
  }
});

// =====================================
// NATIVE VIDEO PLAY BUTTON
// =====================================

video.addEventListener("play", () => {
  clearStatus();

  if (sequenceFinished) {
    resetSequence();
  }

  if (!sequenceStarted) {
    sequenceStarted = true;
  }

  // If audio was already started by
  // the custom button, don't duplicate it.
  if (!audioUnlocked) {
    audioUnlocked = true;
  }

  if (voice.paused || music.paused) {
    startAudio();
  }
});

// =====================================
// PAUSE EVERYTHING
// =====================================

video.addEventListener("pause", () => {
  voice.pause();
  music.pause();
});

// =====================================
// PLAY NEXT RECORDING
// =====================================

voice.addEventListener("ended", () => {

  // Last recording has finished.
  if (
    currentVoiceIndex ===
    voiceFiles.length - 1
  ) {
    finishSequence();
    return;
  }

  // Next recording.
  const nextIndex = currentVoiceIndex + 1;

  loadVoice(nextIndex);

  // Continue automatically if
  // video is still playing.
  if (!video.paused && !sequenceFinished) {

    const generation = ++playGeneration;

    voice.play().catch(error => {
      handlePlayError(
        error,
        "Voice recording " + (nextIndex + 1),
        generation
      );
    });
  }
});

// =====================================
// FINISH ALL SEVEN RECORDINGS
// =====================================

function finishSequence() {
  sequenceFinished = true;

  voice.pause();
  music.pause();
  video.pause();

  showStatus(
    "Seven little messages, just for you. ❤️"
  );

  // Update button for replay.
  startButton.textContent =
    "Listen again ♡";
}

// =====================================
// RESET FOR REPLAY
// =====================================

function resetSequence() {
  playGeneration++;

  voice.pause();
  music.pause();
  video.pause();

  sequenceFinished = false;
  sequenceStarted = false;

  video.currentTime = 0;
  music.currentTime = 0;

  loadVoice(0);

  startButton.textContent =
    "Start our memories ♡";

  clearStatus();
}

// =====================================
// VIDEO ERROR
// =====================================

video.addEventListener("error", () => {
  showStatus(
    "Video could not load. " +
    "Check johnbi-video.mp4."
  );
});

// =====================================
// VOICE ERROR
// =====================================

voice.addEventListener("error", () => {
  if (!voice.src) return;

  showStatus(
    "Cannot load recording: " +
    voiceFiles[currentVoiceIndex]
  );
});

// =====================================
// MUSIC ERROR
// =====================================

music.addEventListener("error", () => {
  showStatus(
    "Cannot load background-music.mp3."
  );
});

// =====================================
// PAGE VISIBILITY
// =====================================

// Pause when the phone is locked
// or the browser is moved to background.

document.addEventListener(
  "visibilitychange",
  () => {
    if (document.hidden && !video.paused) {
      video.pause();
    }
  }
);

// =====================================
// READY
// =====================================

console.log("For My Johnbi ❤️ Ready");
