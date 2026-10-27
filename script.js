const terminal = document.getElementById("terminal");
const resultBox = document.getElementById("resultBox");

const scanButton = document.getElementById("scan");
let nextVirusTotalRequest = 0;

scanButton.addEventListener("click", () => {
    startScan();
});

function startScan() {
    if (scanButton.disabled) return;
    const url = document.getElementById("urlInput").value.trim();
    const apiKey = document.getElementById("apiKey").value.trim();
    terminal.innerHTML = "";
    resultBox.classList.add("hidden");

    if (url === "") return;

    try {
        const target = new URL(url);
        if (!["http:", "https:"].includes(target.protocol) || target.username || target.password) throw new Error();
    } catch {
        resultBox.className = "result warning";
        resultBox.textContent = "Enter a valid HTTP or HTTPS URL without credentials.";
        return;
    }
    scanButton.disabled = true;
    terminal.classList.remove("hidden");

    const lines = [
        "Initializing scan module...",
        "Loading local URL checks...",
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
            setTimeout(() => analyzeURL(url, apiKey), 800);
        }
    }, 600);
}

async function checkVirusTotal(url, apiKey) {
    if (Date.now() < nextVirusTotalRequest) {
        throw new Error("Please wait 16 seconds between VirusTotal lookups (free API rate limit).");
    }
    const bytes = new TextEncoder().encode(url);
    const id = btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(""))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    nextVirusTotalRequest = Date.now() + 16000;
    const response = await fetch(`https://www.virustotal.com/api/v3/urls/${id}`, {
        headers: { "x-apikey": apiKey, "Accept": "application/json" },
        signal: AbortSignal.timeout(15000)
    });
    if (response.status === 404) throw new Error("No existing VirusTotal report for this URL. No external verdict was obtained.");
    if (!response.ok) {
        const hint = response.status === 429 ? "Quota exceeded. Try again later."
            : [401, 403].includes(response.status) ? "Check your VirusTotal API key and account permissions."
            : "Try again later.";
        throw new Error(`HTTP ${response.status}. ${hint}`);
    }
    const data = await response.json();
    const attributes = data?.data?.attributes;
    const stats = attributes?.last_analysis_stats;
    if (!stats || !["malicious", "suspicious", "harmless", "undetected"].every(
        key => Number.isInteger(stats[key]) && stats[key] >= 0)) {
        throw new Error("VirusTotal returned no usable analysis statistics.");
    }
    const total = Object.values(stats).reduce((sum, count) => sum + (Number.isInteger(count) && count >= 0 ? count : 0), 0);
    if (!total) throw new Error("VirusTotal has no completed engine results for this URL.");
    return { stats, analyzedAt: attributes.last_analysis_date };
}

async function analyzeURL(url, apiKey = "") {
    let score = 0;
    let reasons = [];

    const target = new URL(url);
    if (target.protocol !== "https:") {
        score++;
        reasons.push("No HTTPS encryption");
    }
    if (url.length > 75) {
        score++;
        reasons.push("Suspicious URL length");
    }
    if (/^(?:\d+\.){3}\d+$/.test(target.hostname) || target.hostname.startsWith("[")) {
        score++;
        reasons.push("IP-based URL detected");
    }
    ["login","verify","secure","bank","update","free"].forEach(w => {
        if (url.toLowerCase().includes(w)) {
            score++;
            reasons.push(`Keyword detected: ${w}`);
        }
    });
    
    let externalStatus = "VirusTotal: not checked (no API key entered).";
    let externalThreat = false;
    let externalUnavailable = false;
    if (apiKey) {
        terminal.append(document.createTextNode("> Checking VirusTotal..."));
        try {
            const { stats, analyzedAt } = await checkVirusTotal(target.href, apiKey);
            externalThreat = stats.malicious > 0 || stats.suspicious > 0;
            const date = Number.isFinite(analyzedAt) && analyzedAt > 0
                ? new Date(analyzedAt * 1000).toLocaleString() : "unknown";
            externalStatus = `VirusTotal existing report: ${stats.malicious} malicious, ${stats.suspicious} suspicious, ${stats.harmless} harmless, ${stats.undetected} undetected. Last analyzed: ${date}. This does not guarantee safety.`;
        } catch (error) {
            externalUnavailable = true;
            externalStatus = error.name === "TimeoutError"
                ? "VirusTotal unavailable: request timed out."
                : error instanceof TypeError
                    ? "VirusTotal unavailable: network or browser CORS restriction. No external verdict was obtained."
                    : `VirusTotal unavailable: ${error.message}`;
        } finally {
            scanButton.disabled = false;
        }
    } else {
        scanButton.disabled = false;
    }

    const status = score === 0 ? "NO LOCAL RISK INDICATORS" : score <= 2 ? "SUSPICIOUS" : "PHISHING RISK";
    resultBox.className = `result ${externalThreat || score >= 3 ? "danger" : score > 0 || externalUnavailable ? "warning" : "safe"}`;
    resultBox.replaceChildren();
    [`Local checks: ${status}`, ...reasons, externalStatus].forEach(line => {
        const paragraph = document.createElement("div");
        paragraph.textContent = line;
        resultBox.append(paragraph);
    });
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
