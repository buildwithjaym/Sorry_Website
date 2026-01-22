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
let audioUnlocked = false;
let lastFocusEl = null;


siteNameEl.textContent = CONFIG.siteName;
dearLine.textContent = `Hello ${CONFIG.herName},`;
endingLine.textContent = "Pwede napo ta bati? ❤";


function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
const fxCanvas = el("fxCanvas");
const fx = fxCanvas.getContext("2d");

let fxOn = false;
let particles = [];
let rockets = [];
let rafId = null;

function resizeFX() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    fxCanvas.width = Math.floor(window.innerWidth * dpr);
    fxCanvas.height = Math.floor(window.innerHeight * dpr);
    fx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeFX);
resizeFX();

function rand(a, b) { return a + Math.random() * (b - a); }

function launchRocket(x, yTarget) {
    rockets.push({
        x, y: window.innerHeight + 10,
        vx: rand(-0.6, 0.6),
        vy: rand(-11.5, -9.8),
        yTarget,
        exploded: false
    });
}

function explode(x, y, count = 90) {
    for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp = rand(2.2, 6.4);
        particles.push({
            x, y,
            vx: Math.cos(ang) * sp,
            vy: Math.sin(ang) * sp,
            life: rand(50, 90),
            age: 0
        });
    }
}

function drawTextGlow(text) {
    fx.save();
    fx.globalAlpha = 0.9;
    fx.font = "800 56px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    fx.textAlign = "center";
    fx.textBaseline = "middle";

    const x = window.innerWidth / 2;
    const y = window.innerHeight * 0.18;

    fx.shadowBlur = 22;
    fx.shadowColor = "rgba(255,255,255,.55)";
    fx.fillStyle = "rgba(255,255,255,.92)";
    fx.fillText(text, x, y);

    fx.shadowBlur = 0;
    fx.globalAlpha = 1;
    fx.restore();
}

function step() {
    fx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.18;

        // trail dot
        fx.globalAlpha = 0.7;
        fx.beginPath();
        fx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
        fx.fillStyle = "rgba(255,255,255,.85)";
        fx.fill();

        if (!r.exploded && r.y <= r.yTarget) {
            r.exploded = true;
            explode(r.x, r.y, 110);
            rockets.splice(i, 1);
        }
    }

    // particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.985;

        p.age += 1;
        const t = p.age / p.life;
        const alpha = Math.max(0, 1 - t);

        fx.globalAlpha = alpha;
        fx.beginPath();
        fx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        fx.fillStyle = "rgba(255,255,255,.92)";
        fx.fill();

        if (p.age >= p.life) particles.splice(i, 1);
    }

    // message while running
    if (fxOn) drawTextGlow("SORRY BB 🥺");

    // stop when done
    if (fxOn && rockets.length === 0 && particles.length === 0) {
        fxOn = false;
        fxCanvas.classList.remove("show");
        cancelAnimationFrame(rafId);
        rafId = null;
        return;
    }

    rafId = requestAnimationFrame(step);
}

function startFireworks() {
    if (rafId) return;

    fxOn = true;
    fxCanvas.classList.add("show");


    const w = window.innerWidth;
    launchRocket(w * 0.22, window.innerHeight * 0.35);
    launchRocket(w * 0.42, window.innerHeight * 0.28);
    launchRocket(w * 0.62, window.innerHeight * 0.33);
    launchRocket(w * 0.80, window.innerHeight * 0.25);

    setTimeout(() => {
        if (!fxOn) return;
        launchRocket(w * 0.30, window.innerHeight * 0.22);
        launchRocket(w * 0.70, window.innerHeight * 0.22);
    }, 260);

    rafId = requestAnimationFrame(step);
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
    chime();
}

function bindButtonFX(button) {
    if (!button) return;
    button.addEventListener("click", ripple);
    button.addEventListener("mousemove", (e) => {
        const r = button.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        button.style.transform =
            `translateY(-1px) rotateX(${(py - .5) * 6}deg) rotateY(${(px - .5) * -6}deg)`;
    });
    button.addEventListener("mouseleave", () => {
        button.style.transform = "";
    });
}


function audioCtx() {
    if (!window.__ac) window.__ac = new (window.AudioContext || window.webkitAudioContext)();
    return window.__ac;
}

function unlockAudio() {
    if (audioUnlocked || muted) return;
    try {
        const ac = audioCtx();
        if (ac.state === "suspended") ac.resume();

        const o = ac.createOscillator();
        const g = ac.createGain();
        g.gain.value = 0.00001;
        o.connect(g);
        g.connect(ac.destination);
        o.start();
        o.stop(ac.currentTime + 0.01);

        audioUnlocked = true;
    } catch (_) { }
}

["pointerdown", "keydown", "touchstart"].forEach(evt => {
    window.addEventListener(evt, unlockAudio, { once: true });
});

function tone(freq, dur = 0.04, type = "sine", gain = 0.04) {
    if (muted || !audioUnlocked) return;
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
    if (muted || !audioUnlocked) return;
    tone(659, 0.05, "sine", 0.03);
    setTimeout(() => tone(784, 0.06, "sine", 0.03), 60);
    setTimeout(() => tone(988, 0.07, "sine", 0.03), 130);
}

function toggleMute() {
    muted = !muted;
    muteBtn.querySelector(".chipText").textContent = `Sound: ${muted ? "Off" : "On"}`;
    if (!muted) pop();
}


async function typewriter(lines, target) {
    target.textContent = "";
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (let j = 0; j <= line.length; j++) {
            target.textContent = line.slice(0, j);
            tick(); // will only play after unlock
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


function showModal() {
    lastFocusEl = document.activeElement;

    overlay.classList.add("show");
    modal.classList.add("show");

    overlay.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-hidden", "false");

    setTimeout(() => closeBtn && closeBtn.focus(), 0);
    pop();
}

function hideModal() {
    overlay.classList.remove("show");
    modal.classList.remove("show");

    overlay.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-hidden", "true");

    setTimeout(() => {
        if (lastFocusEl && typeof lastFocusEl.focus === "function") lastFocusEl.focus();
        else if (openBtn) openBtn.focus();
    }, 0);
}


function fmtTime(ts) {
    const d = new Date(ts);
    return d.toLocaleString([], { weekday: "short", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

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
    pop();
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

    chime();
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
    chime();
    showToast("Receipt downloaded 💾");
});

clearReceiptBtn.addEventListener("click", () => {
    selected = null;
    localStorage.removeItem("date_receipt");
    receiptCard.classList.remove("show");
    receiptCard.setAttribute("aria-hidden", "true");
    dateIdea.textContent = "Tap to pick a cute plan ✨";
    downloadReceiptBtn.disabled = true;
    pop();
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
