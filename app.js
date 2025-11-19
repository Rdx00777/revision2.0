// --- Data & State ---
let data = JSON.parse(localStorage.getItem('revisionData')) || { topics: [] };
let timerInterval;
let beepInterval;
let audioCtx;

// --- Revision Logic (Spaced Repetition) ---
// Cycles: 1 day, 3 days, 7 days, 14 days, 30 days
const REVISION_CYCLES = [1, 3, 7, 14, 30];

function saveData() {
    localStorage.setItem('revisionData', JSON.stringify(data));
    renderDashboard();
    renderSubjects();
}

function addTopic() {
    const subjectInput = document.getElementById('new-subject-name');
    const topicInput = document.getElementById('new-topic-name');
    
    if (!subjectInput.value || !topicInput.value) return alert('Please fill both fields');

    const newTopic = {
        id: Date.now(),
        subject: subjectInput.value,
        name: topicInput.value,
        created: new Date().toISOString(),
        lastReviewed: new Date().toISOString(),
        cycleIndex: 0,
        nextReview: new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString() // Due tomorrow
    };

    data.topics.push(newTopic);
    subjectInput.value = '';
    topicInput.value = '';
    saveData();
    showView('dashboard'); // Switch back to see it
}

function markReviewed(id) {
    const topic = data.topics.find(t => t.id === id);
    if (topic) {
        // Advance cycle
        topic.cycleIndex = Math.min(topic.cycleIndex + 1, REVISION_CYCLES.length - 1);
        const daysToAdd = REVISION_CYCLES[topic.cycleIndex];
        
        topic.lastReviewed = new Date().toISOString();
        // Set next review date
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + daysToAdd);
        topic.nextReview = nextDate.toISOString();
        
        saveData();
    }
}

// --- View Management ---
function showView(viewId) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(viewId + '-view').classList.add('active');
    // Simple logic to highlight nav item based on order
    const index = ['dashboard', 'subjects', 'timer'].indexOf(viewId);
    document.querySelectorAll('.nav-item')[index].classList.add('active');

    if(viewId === 'dashboard') renderDashboard();
    if(viewId === 'subjects') renderSubjects();
}

function renderDashboard() {
    const dueList = document.getElementById('due-list');
    const today = new Date();
    
    const dueTopics = data.topics.filter(t => new Date(t.nextReview) <= today);
    
    document.getElementById('review-count').innerText = dueTopics.length;
    document.getElementById('total-count').innerText = data.topics.length;
    
    dueList.innerHTML = '';
    if (dueTopics.length === 0) {
        dueList.innerHTML = '<p class="empty-state">All caught up! Great job.</p>';
        return;
    }

    dueTopics.forEach(t => {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.innerHTML = `
            <div>
                <strong>${t.subject}</strong>: ${t.name}
                <div class="topic-meta">Cycle: ${REVISION_CYCLES[t.cycleIndex]} days</div>
            </div>
            <button onclick="markReviewed(${t.id})" style="background:none; border:1px solid #555; color:var(--accent); padding:5px 10px; border-radius:4px;">Done</button>
        `;
        dueList.appendChild(li);
    });
}

function renderSubjects() {
    const list = document.getElementById('subjects-list');
    list.innerHTML = '';
    // Group by subject could be added here, simplified for flat list
    data.topics.forEach(t => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div>
                <strong>${t.subject}</strong>
                <br> ${t.name}
            </div>
            <div class="topic-meta">Next: ${new Date(t.nextReview).toLocaleDateString()}</div>
        `;
        list.appendChild(div);
    });
}

// --- Pomodoro & Sound ---
// Create a continuous beep using AudioContext (no external files needed)
function playContinuousBeep() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create an oscillator that beeps every second
    beepInterval = setInterval(() => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2); // Beep duration 0.2s
    }, 500); // Repeat every 500ms
}

function startTimer() {
    const minutes = parseInt(document.getElementById('timer-minutes').value);
    let seconds = minutes * 60;
    
    document.getElementById('focus-overlay').classList.remove('hidden');
    document.getElementById('focus-status').innerText = "Focus Mode On";
    
    // Prevent screen sleep (if supported)
    if (navigator.wakeLock) navigator.wakeLock.request('screen').catch(console.error);

    updateOverlayDisplay(seconds);

    timerInterval = setInterval(() => {
        seconds--;
        updateOverlayDisplay(seconds);

        if (seconds <= 0) {
            clearInterval(timerInterval);
            document.getElementById('focus-status').innerText = "TIME UP!";
            document.getElementById('overlay-timer').style.color = "var(--danger)";
            playContinuousBeep();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    clearInterval(beepInterval);
    document.getElementById('focus-overlay').classList.add('hidden');
    document.getElementById('overlay-timer').style.color = "white";
    
    // Check notification permissions on interaction
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
}

function updateOverlayDisplay(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    document.getElementById('overlay-timer').innerText = `${m}:${s}`;
}

// --- PWA Service Worker ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker Registered'));
}

// --- Notification Logic ---
function checkDailyNotifications() {
    if (Notification.permission === 'granted') {
        const dueCount = data.topics.filter(t => new Date(t.nextReview) <= new Date()).length;
        if (dueCount > 0) {
            new Notification("Revision Tracker", {
                body: `You have ${dueCount} topics to review today!`,
                icon: 'icon-192.png'
            });
        }
    }
}

// Initial Load
renderDashboard();
// Check permissions on load
if (Notification.permission !== 'denied') Notification.requestPermission();
