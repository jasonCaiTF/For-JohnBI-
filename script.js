"use strict";

// FOR MY JOHNBI ❤️
// Keep one video, one voice player, and one music player in sync.

const openingScreen = document.getElementById("openingScreen");
const openButton = document.getElementById("openButton");
const video = document.getElementById("johnbiVideo");
const voice = document.getElementById("voiceAudio");
const music = document.getElementById("backgroundMusic");
const startButton = document.getElementById("startButton");
const audioStatus = document.getElementById("audioStatus");

const voiceFiles = [
  "给johnbi1.m4a",
  "给johnbi2.m4a",
  "给johnbi3.m4a",
  "给johnbi4.m4a",
  "给johnbi5.m4a",
  "给johnbi6.m4a",
  "给johnbi7.m4a"
];

const AUDIO_VERSION = "12";
const VOICE_VOLUME = 1;
// The music file is pre-attenuated so the mix also works on iPhone Safari,
// where setting HTMLMediaElement.volume from JavaScript is not reliable.
const MUSIC_VOLUME = 1;

let currentVoiceIndex = 0;
let sequenceState = "idle";
let playbackGeneration = 0;

function showStatus(message) {
  audioStatus.textContent = message;
}

function applyVolumes() {
  voice.volume = VOICE_VOLUME;
  music.volume = MUSIC_VOLUME;
}

function voiceUrl(index) {
  return new URL(`${voiceFiles[index]}?v=${AUDIO_VERSION}`, document.baseURI).href;
}

function loadVoice(index) {
  if (index < 0 || index >= voiceFiles.length) {
    return false;
  }

  currentVoiceIndex = index;
  voice.src = voiceUrl(index);
  voice.load();
  applyVolumes();
  return true;
}

function reportPlayError(error, label, generation) {
  if (generation !== playbackGeneration || error.name === "AbortError") {
    return;
  }

  console.error(`${label} playback error:`, error);
  showStatus(
    `${label} could not start. Please tap Start our memories ♡ and try again.`
  );
}

function playSafely(media, label, generation) {
  const playRequest = media.play();

  if (playRequest && typeof playRequest.catch === "function") {
    playRequest.catch((error) => {
      reportPlayError(error, label, generation);
    });
  }
}

function pauseSyncedAudio() {
  playbackGeneration += 1;
  voice.pause();
  music.pause();

  if (sequenceState === "playing") {
    sequenceState = "paused";
  }
}

function resetSequence() {
  playbackGeneration += 1;
  voice.pause();
  music.pause();

  sequenceState = "idle";
  currentVoiceIndex = 0;
  video.currentTime = 0;
  music.currentTime = 0;
  loadVoice(0);

  startButton.textContent = "Start our memories ♡";
  showStatus("");
}

function finishSequence() {
  playbackGeneration += 1;
  sequenceState = "finished";

  voice.pause();
  music.pause();
  music.currentTime = 0;

  if (!video.paused) {
    video.pause();
  }

  startButton.textContent = "Listen again ♡";
  showStatus("Seven little messages, just for you. ❤️");
}

function startOrResumeAudio() {
  if (sequenceState === "finished") {
    resetSequence();
  }

  if (!voice.src) {
    loadVoice(currentVoiceIndex);
  }

  sequenceState = "playing";
  applyVolumes();

  const generation = ++playbackGeneration;
  playSafely(voice, "Voice recording", generation);
  playSafely(music, "Background music", generation);
}

function startExperience() {
  showStatus("");
  startOrResumeAudio();

  const generation = playbackGeneration;
  const videoRequest = video.play();

  if (videoRequest && typeof videoRequest.catch === "function") {
    videoRequest.catch((error) => {
      if (generation !== playbackGeneration || error.name === "AbortError") {
        return;
      }

      console.error("Video playback error:", error);
      pauseSyncedAudio();
      showStatus(
        "Video could not start. Check johnbi-video.mp4, then tap Start our memories ♡ again."
      );
    });
  }
}

openButton.addEventListener("click", () => {
  openingScreen.classList.add("hidden");
  openingScreen.setAttribute("aria-hidden", "true");

  window.setTimeout(() => {
    openingScreen.hidden = true;
  }, 650);
});

startButton.addEventListener("click", startExperience);

video.addEventListener("play", () => {
  showStatus("");

  if (
    sequenceState !== "playing" ||
    voice.paused ||
    music.paused
  ) {
    startOrResumeAudio();
  }
});

video.addEventListener("pause", () => {
  if (sequenceState !== "finished") {
    pauseSyncedAudio();
  }
});

voice.addEventListener("ended", () => {
  if (sequenceState !== "playing") {
    return;
  }

  if (currentVoiceIndex === voiceFiles.length - 1) {
    finishSequence();
    return;
  }

  const nextIndex = currentVoiceIndex + 1;
  loadVoice(nextIndex);

  const generation = ++playbackGeneration;
  playSafely(voice, `Voice recording ${nextIndex + 1}`, generation);
});

video.addEventListener("error", () => {
  pauseSyncedAudio();
  showStatus(
    "Video could not load. Please check that johnbi-video.mp4 was uploaded completely."
  );
});

voice.addEventListener("error", () => {
  if (!voice.src) {
    return;
  }

  pauseSyncedAudio();
  if (!video.paused) {
    video.pause();
  }
  showStatus(`Cannot load recording: ${voiceFiles[currentVoiceIndex]}`);
});

music.addEventListener("error", () => {
  music.pause();
  showStatus(
    "Background music could not load. The voice recording will continue without it."
  );
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && !video.paused) {
    video.pause();
  }
});

video.loop = true;
video.muted = true;
music.loop = true;
applyVolumes();
loadVoice(0);

console.log("For My Johnbi ❤️ Ready");
