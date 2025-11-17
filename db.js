
// IndexedDB setup

let db;
const request = indexedDB.open("revtrackerDB", 1);

request.onupgradeneeded = event => {
    db = event.target.result;
    db.createObjectStore("subjects", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("topics", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = event => {
    db = event.target.result;
    loadSubjects();
};

function addSubject(name) {
    const tx = db.transaction("subjects", "readwrite");
    tx.objectStore("subjects").add({ name });
}

function getSubjects(callback) {
    const tx = db.transaction("subjects", "readonly");
    const store = tx.objectStore("subjects");
    const subjects = [];
    store.openCursor().onsuccess = e => {
        const cursor = e.target.result;
        if(cursor) { subjects.push(cursor.value); cursor.continue(); }
        else callback(subjects);
    };
}

function addTopic(subjectId, title, desc) {
    const tx = db.transaction("topics", "readwrite");
    tx.objectStore("topics").add({ subjectId, title, desc, r1:false, r2:false, r3:false });
}

function getTopics(subjectId, callback) {
    const tx = db.transaction("topics", "readonly");
    const store = tx.objectStore("topics");
    const topics = [];
    store.openCursor().onsuccess = e => {
        const cursor = e.target.result;
        if(cursor) { 
            if(cursor.value.subjectId == subjectId) topics.push(cursor.value);
            cursor.continue(); 
        } else callback(topics);
    };
}
