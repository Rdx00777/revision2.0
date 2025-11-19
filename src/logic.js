import { getAppData, saveData } from './data.js';
import { showToast, vibrate, renderAll, closeModal } from './app.js';
import { DEFAULT_COLOR } from './data.js';

// --- STUDY MODE STATE ---
export let studyTopics = [];
export let currentStudyIndex = 0;

// --- TOPIC MANAGEMENT (CRUD) ---
export function addTopic() {
    const appData = getAppData();
    const sub = document.getElementById('inp-subject').value;
    const top = document.getElementById('inp-topic').value;
    const color = document.getElementById('inp-color').value;

    if(!sub || !top) { showToast("Fill all fields"); return; }

    appData.subjectColors[sub] = color;
    appData.topics.push({
        id: Date.now(), subject: sub, topic: top, notes: "", subjectColor: color,
        cycle: 0, nextDate: new Date().toISOString().split('T')[0]
    });
    saveData();
    document.getElementById('inp-topic').value = '';
    vibrate(20); showToast("Topic Added");
    renderAll();
}

export function markRevised(id, difficulty = 'medium') {
    const appData = getAppData();
    const t = appData.topics.find(x => x.id === id);
    if(!t) return;
    
    if(!appData.history) appData.history = [];
    appData.history.push({ date: new Date().toISOString().split('T')[0], title: t.topic, subject: t.subject, color: t.subjectColor });

    const intervals = appData.customIntervals;
    
    // Difficulty Multiplier
    const multiplier = difficulty === 'easy' ? 2 : difficulty === 'hard' ? 0.5 : 1;
    
    // Increment cycle index
    t.cycle = Math.min(t.cycle + 1, intervals.length - 1);
    
    // Calculate days to add (Base interval * Multiplier)
    const baseDays = intervals[t.cycle] || intervals[intervals.length - 1] || 30;
    const daysToAdd = Math.ceil(baseDays * multiplier); 

    const next = new Date(); next.setDate(next.getDate() + daysToAdd);
    t.nextDate = next.toISOString().split('T')[0];

    saveData(); 
    vibrate([50, 50]);
    showToast(`Reviewed! Next check in ${daysToAdd} days.`);
    renderAll();
}

export function saveEdit() {
    const appData = getAppData();
    const editingId = window.app.editingId; // Accessing shared ID from global scope
    const t = appData.topics.find(x => x.id === editingId);
    if (!t) return;

    const newSubject = document.getElementById('edit-subject').value;
    const newColor = document.getElementById('edit-color').value;

    t.nextDate = document.getElementById('edit-date').value;
    t.topic = document.getElementById('edit-name').value;
    t.subject = newSubject;
    t.subjectColor = newColor;
    
    appData.subjectColors[newSubject] = newColor; 
    
    saveData(); 
    renderAll(); 
    closeModal();
}

export function deleteTopic() { 
    const appData = getAppData();
    const editingId = window.app.editingId;
    if(confirm("Permanently delete this topic?")) { 
        appData.topics = appData.topics.filter(x => x.id !== editingId); 
        saveData(); 
        renderAll(); 
        closeModal(); 
    } 
}

// --- ACTIVE RECALL LOGIC ---
export function loadFlashcard() {
    const appData = getAppData();
    const today = new Date().toISOString().split('T')[0];
    studyTopics = (appData.topics || []).filter(t => t.nextDate <= today).sort(() => 0.5 - Math.random());
    currentStudyIndex = 0;
    
    const contentEl = document.getElementById('study-mode-content');
    const emptyEl = document.getElementById('study-empty');

    if (studyTopics.length === 0) {
        contentEl.style.display = 'none'; emptyEl.style.display = 'block'; return;
    }
    emptyEl.style.display = 'none'; contentEl.style.display = 'block';
    showNextFlashcard();
}

export function showNextFlashcard() {
    const flashcardEl = document.getElementById('current-flashcard'); flashcardEl.classList.remove('flipped');
    
    if (currentStudyIndex >= studyTopics.length) {
        document.getElementById('study-mode-content').style.display = 'none';
        document.getElementById('study-empty').style.display = 'block';
        renderAll(); return;
    }
    // Content generation remains in render.js for consistency, but logic uses local state
    window.render.generateFlashcardContent(studyTopics[currentStudyIndex]);
}

export function flipCard() { document.getElementById('current-flashcard').classList.toggle('flipped'); vibrate(10); }

export function updateIntervals() {
    const appData = getAppData();
    const input = document.getElementById('inp-intervals').value;
    const newIntervals = input.split(',').map(s => parseInt(s.trim())).filter(n => n > 0);

    if (newIntervals.length === 0) {
        showToast("Error: Enter valid numbers.");
        vibrate(50);
        return;
    }

    appData.customIntervals = newIntervals;
    document.getElementById('current-intervals').innerText = newIntervals.join(', ');
    saveData();
    showToast("Custom Intervals Saved!");
    vibrate(20);
}
