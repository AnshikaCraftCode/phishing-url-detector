const terminal = document.getElementById("terminal");
const resultBox = document.getElementById("resultBox");

function startScan() {
    const url = document.getElementById("urlInput").value.trim();
    terminal.innerHTML = "";
    resultBox.classList.add("hidden");

    if (url === "") return;

    terminal.classList.remove("hidden");

    const lines = [
        "Initializing scan module...",
        "Connecting to threat database...",
        "Analyzing URL structure...",
        "Checking encryption...",
        "Detecting phishing patterns...",
        "Finalizing report..."
    ];

    let i = 0;
    const interval = setInterval(() => {
        terminal.innerHTML += "> " + lines[i] + "<br>";
        terminal.scrollTop = terminal.scrollHeight;
        i++;
        if (i === lines.length) {
            clearInterval(interval);
            setTimeout(() => analyzeURL(url), 800);
        }
    }, 600);
}

function analyzeURL(url) {
    let score = 0;
    let reasons = [];

    if (!url.startsWith("https://")) {
        score++;
        reasons.push("No HTTPS encryption");
    }
    if (url.length > 75) {
        score++;
        reasons.push("Suspicious URL length");
    }
    if (/\d+\.\d+\.\d+\.\d+/.test(url)) {
        score++;
        reasons.push("IP-based URL detected");
    }
    ["login","verify","secure","bank","update","free"].forEach(w => {
        if (url.toLowerCase().includes(w)) {
            score++;
            reasons.push(`Keyword detected: ${w}`);
        }
    });

    resultBox.classList.remove("hidden");

    if (score === 0) {
        resultBox.className = "result safe";
        resultBox.innerHTML = "✔ STATUS: SAFE";
    } else if (score <= 2) {
        resultBox.className = "result warning";
        resultBox.innerHTML = "⚠ STATUS: SUSPICIOUS<br>" + reasons.join("<br>");
    } else {
        resultBox.className = "result danger";
        resultBox.innerHTML = "❌ STATUS: PHISHING RISK<br>" + reasons.join("<br>");
    }
}

/* 🔴 Moving red bug particles */
const canvas = document.getElementById("bugs");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bugs = [];
for (let i = 0; i < 60; i++) {
    bugs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 1.5 + 0.5
    });
}

function animateBugs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff2e2e";

    bugs.forEach(bug => {
        ctx.beginPath();
        ctx.arc(bug.x, bug.y, 2, 0, Math.PI * 2);
        ctx.fill();

        bug.y += bug.speed;
        if (bug.y > canvas.height) bug.y = 0;
    });

    requestAnimationFrame(animateBugs);
}

animateBugs();