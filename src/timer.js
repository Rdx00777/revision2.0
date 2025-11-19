import { getAppData, saveData } from './data.js';
import { closeModal, showToast, vibrate } from './app.js';

export let timerInt = null;
export let audioCtx = null;
export let currentAudio = null;

// --- SOUND ASSETS ---
const SOUNDS = {
    rain: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
    forest: 'https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg'
};

// --- THEME SWITCHER ---
export function switchTheme(theme) {
    document.body.className = `theme-${theme}`;
    getAppData().theme = theme;
    saveData();
    vibrate(10);
}

// --- TIMER LOGIC ---
export function startFocus() {
    closeModal(); 

    const cycleType = document.getElementById('cycle-select').value;
    let totalMins = cycleType === '5217' ? 52 : 25;
    let breakMins = cycleType === '5217' ? 17 : 5;
    let secs = totalMins * 60;
    const disp = document.getElementById('timer-display');
    const type = document.getElementById('sound-select').value;
    
    document.getElementById('timer-overlay').classList.add('visible');
    if (navigator.wakeLock) navigator.wakeLock.request('screen').catch(e=>{});

    // Audio
    if(type !== 'silent' && SOUNDS[type]) {
        currentAudio = new Audio(SOUNDS[type]); 
        currentAudio.loop = true;
        currentAudio.play().catch(e => console.log("Audio blocked"));
    }

    clearInterval(timerInt);
    timerInt = setInterval(() => {
        secs--;
        const m = Math.floor(secs/60).toString().padStart(2,'0');
        const s = (secs%60).toString().padStart(2,'0');
        disp.innerText = `${m}:${s}`;
        
        if(secs <= 0) { 
            clearInterval(timerInt); 
            disp.style.color = 'var(--danger)'; 
            vibrate([500, 200, 500]);
            if(currentAudio) { currentAudio.pause(); currentAudio = null; }
            playAlarm();
            setTimeout(() => alert(`Time for a ${breakMins} minute break!`), 1000);
        }
    }, 1000);
    vibrate(10);
}

export function stopFocus() {
    clearInterval(timerInt);
    document.getElementById('timer-overlay').classList.remove('visible');
    document.getElementById('timer-display').style.color = 'white';
    
    if(currentAudio) { currentAudio.pause(); currentAudio = null; }
    if(audioCtx) { audioCtx.close(); audioCtx = null; }
    vibrate(10);
}

export function playAlarm() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime); osc.start();
    
    let alarmInt = setInterval(() => {
        if(audioCtx && audioCtx.state === 'running') {
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            setTimeout(() => gain.gain.setValueAtTime(0, audioCtx.currentTime), 200);
        } else {
            clearInterval(alarmInt);
        }
    }, 600);
}
