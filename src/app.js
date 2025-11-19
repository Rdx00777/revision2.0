import { saveData, checkStreak, getAppData } from './data.js';
import { stopFocus } from './timer.js';
import { renderAll } from './render.js';
import { loadFlashcard } from './logic.js';

// --- GLOBAL UTILITIES ---
export function vibrate(ms) { 
    if(navigator.vibrate) navigator.vibrate(ms); 
}

export function showToast(msg) {
    const t = document.getElementById("toast"); 
    t.innerText = msg; 
    t.className = "show";
    setTimeout(() => t.className = "", 3000);
}

export function closeModal() { 
    document.getElementById('edit-modal').classList.remove('open');
    vibrate(10);
}

// --- APPLICATION INITIALIZATION ---
export function initialize() {
    // Set current date on header
    document.getElementById('header-date').innerText = new Date().toLocaleDateString(undefined, {weekday:'short', day:'numeric', month:'short'});
    
    // Check streak and render initial views
    checkStreak();
    renderAll();
}

// --- NAVIGATION ---
export function switchView(view, btn) {
    // Ensure timer and modals are stopped before navigating
    stopFocus(); 
    closeModal(); 
    
    // Switch active view
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + view).classList.add('active');
    
    // Switch active nav icon
    document.querySelectorAll('.nav-icon').forEach(n => n.classList.remove('active'));
    btn.classList.add('active'); 
    
    vibrate(10);
    
    // Special logic for study mode
    if(view === 'study') loadFlashcard();
}

// Re-export rendering function for ease of use in logic.js
export { renderAll } from './render.js'; 
