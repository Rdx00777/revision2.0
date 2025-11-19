import { showToast } from './app.js';

// --- CONFIG & STATE ---
const STORAGE_KEY = 'neon_focus_v9';
export const DEFAULT_INTERVALS = [3, 7, 14, 30, 60, 90]; 
export const DEFAULT_COLOR = '#00f2ff';

// Central data object, initialized upon load
export let appData = loadData();

// --- DATA MANAGEMENT ---
export function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    let data = raw ? JSON.parse(raw) : { 
        topics: [], history: [], streak: 0, lastLogin: '', username: '', 
        subjectColors: {}, customIntervals: DEFAULT_INTERVALS, theme: 'neon'
    };
    // Ensure properties exist for safety
    if (!data.topics) data.topics = []; 
    if (!data.customIntervals) data.customIntervals = DEFAULT_INTERVALS;
    // Migration for color property safety
    data.topics.forEach(t => {
        t.subjectColor = t.subjectColor || data.subjectColors[t.subject] || DEFAULT_COLOR;
    });
    return data;
}

export function saveData() { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); 
}

export function checkStreak() {
    const today = new Date().toDateString();
    if(appData.lastLogin !== today) {
        const yest = new Date(); yest.setDate(yest.getDate() - 1);
        if(appData.lastLogin === yest.toDateString()) appData.streak++; else appData.streak = 1;
        appData.lastLogin = today; 
        saveData();
    }
}

export function updateUsername() { 
    appData.username = document.getElementById('inp-username').value; 
    saveData(); 
}

// --- BACKUP/IMPORT ---
export function exportData() {
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(new Blob([JSON.stringify(appData)], {type: "application/json"}));
    a.download = `neon_backup_${new Date().toISOString().split('T')[0]}.json`; 
    a.click(); 
    app.vibrate(20);
}

export function importData(input) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if(imported.topics) { 
                appData = imported; 
                saveData(); 
                app.renderAll(); 
                showToast("Data Restored Successfully!"); 
                app.vibrate(50); 
            }
        } catch(err) { 
            alert("Invalid File Format. Please ensure the file is a valid NeonFocus JSON backup."); 
        }
    };
    if(input.files[0]) reader.readAsText(input.files[0]);
}

// --- PUBLIC GETTERS (to ensure other modules don't modify data directly) ---
export const getAppData = () => appData;
export const getIntervals = () => appData.customIntervals;
