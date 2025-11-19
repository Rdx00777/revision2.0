import { getAppData } from './data.js';
import { DEFAULT_COLOR } from './data.js';

// Helper to access external functions (must use window for logic/app)
const logic = window.logic; 
const app = window.app;

// --- MAIN RENDERING LOOPS ---
export function renderAll() { 
    renderDashboard(); 
    renderSubjects(); 
    renderHeatmap(); 
    renderHistory();
}

export function renderDashboard() {
    const appData = getAppData();
    const list = document.getElementById('due-list'); list.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];
    let count = 0;
    
    (appData.topics || []).forEach(t => {
        if(t.nextDate <= today) { count++; list.appendChild(createCard(t, true)); }
    });
    if(count === 0) list.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:20px;">All caught up!</div>`;
    
    document.getElementById('due-count').innerText = count;
    document.getElementById('streak-count').innerText = `🔥 ${appData.streak}`;
    document.getElementById('mastery-score').innerText = `${logic.calculateMasteryScore()}%`;
}

export function renderSubjects() {
    const appData = getAppData();
    const list = document.getElementById('all-list'); list.innerHTML = '';
    
    const topicsArray = appData.topics || [];
    if (topicsArray.length === 0) return;

    const sorted = [...topicsArray].sort((a, b) => (a.subject || '').localeCompare(b.subject || ''));

    sorted.forEach(t => list.appendChild(createCard(t, false)));
}

export function renderHistory() {
    const appData = getAppData();
    const list = document.getElementById('history-list');
    if(!appData.history || appData.history.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:var(--text-muted)">No activity yet.</p>`;
        return;
    }
    
    list.innerHTML = '';
    (appData.history || []).slice().reverse().forEach(h => {
        const color = h.color || DEFAULT_COLOR;
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="history-date" style="border-right-color: ${color};">
                ${new Date(h.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                <div style="font-size:0.7em; color:${color}; margin-top:3px;">${h.subject || 'Topic'}</div>
            </div>
            <div>
                <div style="font-weight:bold;">${h.title}</div>
                <div style="font-size:0.8rem; color:var(--text-muted);">Marked Complete</div>
            </div>
        `;
        list.appendChild(div);
    });
}

export function renderHeatmap() {
    const appData = getAppData();
    const container = document.getElementById('heatmap'); container.innerHTML = '';
    const activityMap = {};
    (appData.history || []).forEach(h => { activityMap[h.date] = (activityMap[h.date] || 0) + 1; });
    for(let i = 84; i >= 0; i--) {
        const d = new Date(); d.setDate(new Date().getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const count = activityMap[dateStr] || 0;
        const div = document.createElement('div');
        div.className = `heat-day ${count > 4 ? 'heat-3' : count > 1 ? 'heat-2' : count > 0 ? 'heat-1' : ''}`;
        div.title = `${dateStr}: ${count} revisions`;
        container.appendChild(div);
    }
}

// --- CARD GENERATION ---
export function createCard(t, isDue) {
    const color = t.subjectColor || getAppData().subjectColors[t.subject] || DEFAULT_COLOR;
    const div = document.createElement('div');
    div.className = 'glass-card subject-item';
    div.innerHTML = `
        <div class="cycle-badge" style="background-color:${color}; color:#000; border-color:${color};">C${t.cycle || 0}</div>
        <div class="subject-header">
            <div><div class="subject-meta" style="color:${color};">${t.subject || 'N/A'}</div><div class="subject-name">${t.topic || 'N/A'}</div></div>
            ${isDue ? `<button class="btn-revised" onclick="logic.markRevised(${t.id})">✔ DONE</button>` : ''}
        </div>
        
        <div class="date-control">
            <span class="status-badge ${isDue ? 'status-due' : 'status-good'}">${isDue ? 'DUE NOW' : 'Wait'}</span>
            <div>
                <span style="color:var(--text-muted); font-size:0.8rem; margin-right:10px;">${t.nextDate}</span>
                <button class="btn-icon" onclick="render.toggleNotes(${t.id})">📝</button>
                <button class="btn-icon" onclick="app.openEdit(${t.id})">⚙️</button>
            </div>
        </div>
        <div id="notes-${t.id}" class="notes-area">
            <textarea class="notes-input" placeholder="Add notes..." onchange="render.saveNotes(${t.id}, this.value)">${t.notes || ''}</textarea>
        </div>
    `;
    return div;
}

// --- STUDY CARD CONTENT GENERATOR ---
export function generateFlashcardContent(t) {
    const color = t.subjectColor || DEFAULT_COLOR;
    document.getElementById('card-front').innerHTML = `
        <div style="font-size:0.8rem; color:${color}; margin-bottom:10px;">${t.subject || 'N/A'}</div>
        <div style="font-size:1.8rem; font-weight:700;">${t.topic || 'N/A'}</div>
        <div style="margin-top:20px; color:${color};">Think of the answer!</div>
    `;
    document.getElementById('card-back').innerHTML = `
        <div style="font-size:1.5rem; margin-bottom:10px; color:${color};">Answer / Notes:</div>
        <div style="font-size:1rem; color:#ccc; max-height:100px; overflow-y:auto;">${t.notes || 'No notes available. Add some in the Library view.'}</div>
        <div style="font-size:1.5rem; margin-top:20px;">Recall Rating</div>
        <div class="difficulty-btns">
            <button class="difficulty-easy" onclick="logic.markRecall('easy', ${t.id})">Easy (+x2)</button>
            <button class="difficulty-medium" onclick="logic.markRecall('medium', ${t.id})">Medium (+x1)</button>
            <button class="difficulty-hard" onclick="logic.markRecall('hard', ${t.id})">Hard (+x0.5)</button>
        </div>
    `;
}

// --- NOTES UTILITIES (Kept here as it interacts with DOM structure) ---
export function toggleNotes(id) { document.getElementById(`notes-${id}`).classList.toggle('visible'); app.vibrate(10); }
export function saveNotes(id, val) { 
    const t = getAppData().topics.find(x => x.id === id); 
    if(t) { t.notes = val; window.data.saveData(); } 
}
            <textarea class="notes-input" placeholder="Add notes..." onchange="render.saveNotes(${t.id}, this.value)">${t.notes || ''}</textarea>
        </div>
    `;
    return div;
}

// --- STUDY CARD CONTENT GENERATOR ---
export function generateFlashcardContent(t) {
    const color = t.subjectColor || DEFAULT_COLOR;
    document.getElementById('card-front').innerHTML = `
        <div style="font-size:0.8rem; color:${color}; margin-bottom:10px;">${t.subject || 'N/A'}</div>
        <div style="font-size:1.8rem; font-weight:700;">${t.topic || 'N/A'}</div>
        <div style="margin-top:20px; color:${color};">Think of the answer!</div>
    `;
    document.getElementById('card-back').innerHTML = `
        <div style="font-size:1.5rem; margin-bottom:10px; color:${color};">Answer / Notes:</div>
        <div style="font-size:1rem; color:#ccc; max-height:100px; overflow-y:auto;">${t.notes || 'No notes available. Add some in the Library view.'}</div>
        <div style="font-size:1.5rem; margin-top:20px;">Recall Rating</div>
        <div class="difficulty-btns">
            <button class="difficulty-easy" onclick="logic.markRecall('easy', ${t.id})">Easy (+x2)</button>
            <button class="difficulty-medium" onclick="logic.markRecall('medium', ${t.id})">Medium (+x1)</button>
            <button class="difficulty-hard" onclick="logic.markRecall('hard', ${t.id})">Hard (+x0.5)</button>
        </div>
    `;
}

// --- NOTES UTILITIES (Kept here as it interacts with DOM structure) ---
export function toggleNotes(id) { document.getElementById(`notes-${id}`).classList.toggle('visible'); app.vibrate(10); }
export function saveNotes(id, val) { 
    const t = getAppData().topics.find(x => x.id === id); 
    if(t) { t.notes = val; app.saveData(); } 
}
