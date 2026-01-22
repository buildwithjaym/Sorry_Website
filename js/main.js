const CONFIG = {
    herName: "Bb Maymay",
    siteName: "My Sorry Website",
    typedLines: [
        "Hi, Bb naku. I’m sorry po.",
        "I really wanted to call.",
        "But life got really busy huhu.",
        "But promise, you never left my mind.",
        "Pwede po maging bati na ta?",
        "Pleaseeeeeeeeeeeeee🥺"
    ],
    dateIdeas: [
        "Slow walk padulong santa clara.",
        "Milk tea + fries.",
        "Favorite food",
        "Study buddy.",
        "I'll call once a week",
        "Chocolate."
    ]
};

const el = (id) => document.getElementById(id);

const typedEl = el("typed");
const siteNameEl = el("siteName");
const dearLine = el("dearLine");
const endingLine = el("endingLine");
const openBtn = el("openBtn");
const closeBtn = el("closeBtn");
const overlay = el("overlay");
const modal = el("modal");
const forgiveBtn = el("forgiveBtn");
const hugBtn = el("hugBtn");
const heartsBtn = el("heartsBtn");
const planBtn = el("planBtn");
const dateIdea = el("dateIdea");
const toast = el("toast");
const muteBtn = el("muteBtn");

const picker = el("picker");
const receiptCard = el("receiptCard");
const receiptMeta = el("receiptMeta");
const receiptIdea = el("receiptIdea");
const receiptSaved = el("receiptSaved");
const downloadReceiptBtn = el("downloadReceiptBtn");
const clearReceiptBtn = el("clearReceiptBtn");
const receiptCanvas = el("receiptCanvas");


let muted = false;

siteNameEl.textContent = CONFIG.siteName;
dearLine.textContent = `Hello ${CONFIG.herName},`;
endingLine.textContent = "Can we reset? I’ll make it up to you. ❤";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function typewriter(lines, target) {
    target.textContent = "";
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (let j = 0; j <= line.length; j++) {
            target.textContent = line.slice(0, j);
            if (!muted) tick();
            await sleep(22 + Math.random() * 22);
        }
        await sleep(650);
        if (i !== lines.length - 1) {
            for (let k = line.length; k >= 0; k--) {
                target.textContent = line.slice(0, k);
                await sleep(10);
            }
            await sleep(120);
        }
    }
}

function ripple(e) {
    const btn = e.currentTarget;
    const r = document.createElement("span");
    r.className = "ripple";
    const rect = btn.getBoundingClientRect();
    r.style.left = (e.clientX - rect.left) + "px";
    r.style.top = (e.clientY - rect.top) + "px";
    btn.appendChild(r);
    setTimeout(() => r.remove(), 650);
}

function showModal() {
    overlay.classList.add("show");
    modal.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-hidden", "false");
    if (!muted) pop();
}

function hideModal() {
    overlay.classList.remove("show");
    modal.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-hidden", "true");
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
}

function spawnHeart(x, y) {
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = ["❤", "💗", "💞", "💖", "💕"][Math.floor(Math.random() * 5)];
    h.style.left = x + "px";
    h.style.top = y + "px";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1200);
}

function burstHearts(centerX, centerY, count = 10) {
    for (let i = 0; i < count; i++) {
        const dx = (Math.random() * 60 - 30);
        const dy = (Math.random() * 20 - 10);
        spawnHeart(centerX + dx, centerY + dy);
    }
    if (!muted) chime();
}

function pickIdea() {
    const idea = CONFIG.dateIdeas[Math.floor(Math.random() * CONFIG.dateIdeas.length)];
    dateIdea.textContent = idea;
    dateIdea.classList.remove("pop");
    void dateIdea.offsetWidth;
    dateIdea.classList.add("pop");
    if (!muted) pop();
}

function bindButtonFX(button) {
    button.addEventListener("click", ripple);
    button.addEventListener("mousemove", (e) => {
        const r = button.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        button.style.transform = `translateY(-1px) rotateX(${(py - .5) * 6}deg) rotateY(${(px - .5) * -6}deg)`;
    });
    button.addEventListener("mouseleave", () => {
        button.style.transform = "";
    });
}

function audioCtx() {
    if (!window.__ac) {
        window.__ac = new (window.AudioContext || window.webkitAudioContext)();
    }
    return window.__ac;
}
function tone(freq, dur = 0.04, type = "sine", gain = 0.04) {
    const ac = audioCtx();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g);
    g.connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + dur);
}
function tick() { tone(880, 0.015, "triangle", 0.02); }
function pop() { tone(520, 0.05, "sine", 0.03); }
function chime() {
    tone(659, 0.05, "sine", 0.03);
    setTimeout(() => tone(784, 0.06, "sine", 0.03), 60);
    setTimeout(() => tone(988, 0.07, "sine", 0.03), 130);
}

function toggleMute() {
    muted = !muted;
    muteBtn.querySelector(".chipText").textContent = `Sound: ${muted ? "Off" : "On"}`;
    if (!muted) pop();
}

openBtn.addEventListener("click", showModal);
closeBtn.addEventListener("click", hideModal);
overlay.addEventListener("click", hideModal);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideModal();
});

forgiveBtn.addEventListener("click", (e) => {
    showToast("Thank you… I’ll do better. ❤");
    const r = forgiveBtn.getBoundingClientRect();
    burstHearts(r.left + r.width / 2, r.top + r.height / 2, 14);
});

hugBtn.addEventListener("click", (e) => {
    showToast("Sending the warmest hug right now 🤍");
    const r = hugBtn.getBoundingClientRect();
    burstHearts(r.left + r.width / 2, r.top + r.height / 2, 10);
});

heartsBtn.addEventListener("click", (e) => {
    const r = heartsBtn.getBoundingClientRect();
    burstHearts(r.left + r.width / 2, r.top + r.height / 2, 16);
});

planBtn.addEventListener("click", pickIdea);

muteBtn.addEventListener("click", toggleMute);

[openBtn, closeBtn, forgiveBtn, hugBtn, heartsBtn, planBtn, muteBtn].forEach(bindButtonFX);

document.addEventListener("click", (e) => {
    if (Math.random() < 0.08) spawnHeart(e.clientX, e.clientY);
});

typewriter(CONFIG.typedLines, typedEl);
