// js/main.js

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
let selected = null;

siteNameEl.textContent = CONFIG.siteName;
dearLine.textContent = `Hello ${CONFIG.herName},`;
endingLine.textContent = "Pwede napo ta bati? ❤";

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

function bindButtonFX(button) {
    if (!button) return;
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
    if (!window.__ac) window.__ac = new (window.AudioContext || window.webkitAudioContext)();
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

function fmtTime(ts) {
    const d = new Date(ts);
    return d.toLocaleString([], { weekday: "short", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

/* ---- Picker + Receipt ---- */
function buildPicker() {
    picker.innerHTML = "";
    CONFIG.dateIdeas.forEach((idea) => {
        const b = document.createElement("button");
        b.className = "pickerBtn";
        b.type = "button";
        b.innerHTML = `<strong>${idea}</strong><small>Tap to choose</small>`;
        b.addEventListener("click", (e) => {
            ripple({ currentTarget: b, clientX: e.clientX, clientY: e.clientY });
            chooseIdea(idea);
            closePicker();
        });
        picker.appendChild(b);
    });
}

function openPicker() {
    picker.classList.add("show");
    picker.setAttribute("aria-hidden", "false");
    if (!muted) pop();
}

function closePicker() {
    picker.classList.remove("show");
    picker.setAttribute("aria-hidden", "true");
}

function togglePicker() {
    const isOpen = picker.classList.contains("show");
    isOpen ? closePicker() : openPicker();
}

function chooseIdea(idea) {
    const ts = Date.now();
    selected = { idea, ts };
    localStorage.setItem("date_receipt", JSON.stringify(selected));

    dateIdea.textContent = idea;
    dateIdea.classList.remove("pop");
    void dateIdea.offsetWidth;
    dateIdea.classList.add("pop");

    updateReceiptUI(selected);
    receiptCard.classList.add("show", "receiptStamp");
    receiptCard.setAttribute("aria-hidden", "false");
    setTimeout(() => receiptCard.classList.remove("receiptStamp"), 600);

    downloadReceiptBtn.disabled = false;
    if (!muted) chime();
    showToast("Naka save na siya ✨");
}

function updateReceiptUI(data) {
    receiptIdea.textContent = data.idea;
    receiptSaved.textContent = fmtTime(data.ts);
    receiptMeta.textContent = "Stored on this device";
}

function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
}

function wrapText(ctx, text, x, y, maxW, lineH) {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
        const test = line + words[n] + " ";
        if (ctx.measureText(test).width > maxW && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + " ";
            y += lineH;
        } else {
            line = test;
        }
    }
    ctx.fillText(line, x, y);
}

function drawReceiptPNG(data) {
    const ctx = receiptCanvas.getContext("2d");
    const W = receiptCanvas.width;
    const H = receiptCanvas.height;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0b0b12");
    bg.addColorStop(1, "#151527");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 0.16;
    ctx.beginPath(); ctx.arc(W * 0.22, H * 0.25, 180, 0, Math.PI * 2); ctx.fillStyle = "#ff6aa8"; ctx.fill();
    ctx.beginPath(); ctx.arc(W * 0.78, H * 0.28, 210, 0, Math.PI * 2); ctx.fillStyle = "#7c5cff"; ctx.fill();
    ctx.beginPath(); ctx.arc(W * 0.52, H * 0.78, 240, 0, Math.PI * 2); ctx.fillStyle = "#43ffd2"; ctx.fill();
    ctx.globalAlpha = 1;

    const cardX = 90, cardY = 85, cardW = W - 180, cardH = H - 170, r = 34;

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    roundRect(ctx, cardX, cardY, cardW, cardH, r);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "800 46px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText("Date Receipt", cardX + 44, cardY + 86);

    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = "600 26px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText("Picked plan:", cardX + 44, cardY + 165);

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "800 34px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    wrapText(ctx, data.idea, cardX + 44, cardY + 215, cardW - 88, 44);

    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = "600 26px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText("Saved:", cardX + 44, cardY + cardH - 140);

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "800 30px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(fmtTime(data.ts), cardX + 44, cardY + cardH - 92);

    ctx.globalAlpha = 0.18;
    ctx.font = "900 150px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("❤", cardX + cardW - 210, cardY + cardH - 90);
    ctx.globalAlpha = 1;

    return receiptCanvas.toDataURL("image/png");
}

/* ---- Events ---- */
openBtn.addEventListener("click", showModal);
closeBtn.addEventListener("click", hideModal);
overlay.addEventListener("click", hideModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

forgiveBtn.addEventListener("click", () => {
    showToast("Thank you… I’ll do better. ❤");
    const r = forgiveBtn.getBoundingClientRect();
    burstHearts(r.left + r.width / 2, r.top + r.height / 2, 14);
});

hugBtn.addEventListener("click", () => {
    showToast("Sending the warmest hug right now 🤍");
    const r = hugBtn.getBoundingClientRect();
    burstHearts(r.left + r.width / 2, r.top + r.height / 2, 10);
});

heartsBtn.addEventListener("click", () => {
    const r = heartsBtn.getBoundingClientRect();
    burstHearts(r.left + r.width / 2, r.top + r.height / 2, 16);
});

planBtn.addEventListener("click", togglePicker);
dateIdea.addEventListener("click", togglePicker);

downloadReceiptBtn.addEventListener("click", () => {
    if (!selected) return;
    const url = drawReceiptPNG(selected);
    const a = document.createElement("a");
    a.href = url;
    a.download = "date-receipt.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (!muted) chime();
    showToast("Receipt downloaded 💾");
});

clearReceiptBtn.addEventListener("click", () => {
    selected = null;
    localStorage.removeItem("date_receipt");
    receiptCard.classList.remove("show");
    receiptCard.setAttribute("aria-hidden", "true");
    dateIdea.textContent = "Tap to pick a cute plan ✨";
    downloadReceiptBtn.disabled = true;
    if (!muted) pop();
    showToast("Cleared.");
});

muteBtn.addEventListener("click", toggleMute);

[openBtn, closeBtn, forgiveBtn, hugBtn, heartsBtn, planBtn, muteBtn, downloadReceiptBtn, clearReceiptBtn]
    .forEach(bindButtonFX);


document.addEventListener("click", (e) => {
    if (Math.random() < 0.08) spawnHeart(e.clientX, e.clientY);
});


buildPicker();

const saved = localStorage.getItem("date_receipt");
if (saved) {
    try {
        selected = JSON.parse(saved);
        dateIdea.textContent = selected.idea;
        updateReceiptUI(selected);
        receiptCard.classList.add("show");
        receiptCard.setAttribute("aria-hidden", "false");
        downloadReceiptBtn.disabled = false;
    } catch (_) { }
}

typewriter(CONFIG.typedLines, typedEl);
