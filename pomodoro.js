
let timer;
function startPomodoro() {
    timer = setTimeout(() => {
        beepLoop();
    }, 25 * 60 * 1000);
}

let beepInterval;
function beepLoop() {
    beepInterval = setInterval(() => {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play();
    }, 1000);
}

function stopBeep() {
    clearInterval(beepInterval);
}
