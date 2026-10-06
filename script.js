const openingScreen = document.getElementById("openingScreen");
const openButton = document.getElementById("openButton");

const video = document.getElementById("myVideo");
const voice = document.getElementById("voiceAudio");
const music = document.getElementById("backgroundMusic");


// =========================
// Voice Recordings
// =========================

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


// =========================
// Audio Settings
// =========================

voice.volume = 1.0;

// Background music is intentionally very quiet.
music.volume = 0.07;


// =========================
// Opening Screen
// =========================

openButton.addEventListener("click", () => {

    openingScreen.classList.add("hidden");

});


// =========================
// Load Voice
// =========================

function loadVoice(index) {

    if (index < 0 || index >= voiceFiles.length) {
        return;
    }

    currentVoiceIndex = index;

    voice.src = voiceFiles[index];

    voice.load();

}


// Load first recording
loadVoice(0);


// =========================
// Play All Audio
// =========================

async function startAudio() {

    try {
        await voice.play();
    } catch (error) {
        console.log("Voice playback blocked:", error);
    }

    try {
        await music.play();
    } catch (error) {
        console.log("Background music playback blocked:", error);
    }

}


// =========================
// Video Starts
// =========================

video.addEventListener("play", () => {

    startAudio();

});


// =========================
// Video Pauses
// =========================

video.addEventListener("pause", () => {

    voice.pause();
    music.pause();

});


// =========================
// Next Voice Recording
// =========================

voice.addEventListener("ended", () => {

    currentVoiceIndex++;

    if (currentVoiceIndex < voiceFiles.length) {

        loadVoice(currentVoiceIndex);

        // Continue automatically if video is still playing.
        if (!video.paused && !video.ended) {
            voice.play().catch(error => {
                console.log("Next voice playback blocked:", error);
            });
        }

    }

});


// =========================
// Video Ends
// =========================

video.addEventListener("ended", () => {

    voice.pause();
    music.pause();

    voice.currentTime = 0;
    music.currentTime = 0;

    currentVoiceIndex = 0;

    loadVoice(0);

});


// =========================
// Keep Voice & Music In Sync
// =========================

let lastSyncTime = 0;

video.addEventListener("timeupdate", () => {

    const now = Date.now();

    // Only check every 500ms.
    if (now - lastSyncTime < 500) {
        return;
    }

    lastSyncTime = now;


    /*
       Background music follows the video.
       Voice recordings are separate files, so their
       timing is controlled by the recording sequence.
    */

});


// =========================
// If User Seeks
// =========================

video.addEventListener("seeking", () => {

    /*
       Since there are seven separate voice recordings,
       we don't force the voice position to the video's
       exact timestamp.

       This prevents accidentally jumping to the wrong
       recording.
    */

});