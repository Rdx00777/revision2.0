
function loadSubjects() {
    getSubjects(subjects => {
        const list = document.getElementById("subjectList");
        list.innerHTML = "";
        subjects.forEach(sub => {
            const btn = document.createElement("button");
            btn.textContent = sub.name;
            btn.onclick = () => loadSubjectContent(sub);
            list.appendChild(btn);
        });
    });
}

function loadSubjectContent(sub) {
    getTopics(sub.id, topics => {
        const div = document.getElementById("subjectContent");
        div.innerHTML = `
            <h2>${sub.name}</h2>
            <button onclick="openTopicModal(${sub.id})">+ Add Topic</button>
            <div id="topicList"></div>
        `;
        const topicList = div.querySelector("#topicList");
        topics.forEach(t => {
            const card = document.createElement("div");
            card.innerHTML = `
                <b>${t.title}</b>
                <p>${t.desc}</p>
                <button onclick="markRevision(${t.id}, 'r1')">R1: ${t.r1 ? '✓' : ''}</button>
                <button onclick="markRevision(${t.id}, 'r2')">R2: ${t.r2 ? '✓' : ''}</button>
                <button onclick="markRevision(${t.id}, 'r3')">R3: ${t.r3 ? '✓' : ''}</button>
                <hr>
            `;
            topicList.appendChild(card);
        });
    });
}

document.getElementById("addSubjectBtn").onclick = () => {
    document.getElementById("subjectModal").classList.remove("hidden");
};

document.getElementById("saveSubjectBtn").onclick = () => {
    const name = document.getElementById("subjectNameInput").value;
    addSubject(name);
    closeSubjectModal();
    loadSubjects();
};

function closeSubjectModal() { document.getElementById("subjectModal").classList.add("hidden"); }

function openTopicModal(subId) {
    window.currentSubjectId = subId;
    document.getElementById("topicModal").classList.remove("hidden");
}

document.getElementById("saveTopicBtn").onclick = () => {
    const title = document.getElementById("topicTitleInput").value;
    const desc = document.getElementById("topicDescInput").value;
    addTopic(window.currentSubjectId, title, desc);
    closeTopicModal();
};

function closeTopicModal() { document.getElementById("topicModal").classList.add("hidden"); }

function markRevision(id, field) {
    // TODO: implement full revision update
    alert("Revision updated (placeholder)");
}
