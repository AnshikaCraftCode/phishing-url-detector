# phishing-url-detector
## Run locally

Open `index.html` in your browser. No installation, server, or API key is needed.

For optional VirusTotal checks, create a VirusTotal Community account and copy your API key from your account menu. Paste it into the app before scanning. The key stays in the current tab and is never saved; it remains visible in browser requests. Never publish it in source code.

The app retrieves an **existing URL report**, including engine counts and the analysis date; it does not submit a fresh scan or poll for results. Missing reports and API failures are shown separately from local checks. Queried URLs may be scanned and added to VirusTotal's community dataset; avoid sensitive URLs. See the [URL report API](https://docs.virustotal.com/reference/url-info) and [submission/privacy notice](https://docs.virustotal.com/reference/scan-url).

The free public API allows 4 requests per minute and 500 per day and prohibits commercial use and certain business workflows. This tab spaces requests by at least 16 seconds; other tabs and apps share your account quota. See [usage restrictions](https://docs.virustotal.com/reference/public-vs-premium-api).

Direct requests depend on VirusTotal allowing your browser origin through CORS. If blocked, frontend JavaScript cannot bypass that policy; the app displays the failure and retains local checks.

A phishing URL detection tool built using HTML, CSS, and JavaScript with scan animations and phishing pattern analysis.
A frontend-based phishing URL detection tool built using **HTML, CSS, and JavaScript**, designed to demonstrate basic **security analysis logic** with an interactive scanning interface.
## 🚀 Overview

This project allows users to analyze a given URL for common phishing indicators.  
It simulates a scan process and highlights potential risks based on URL structure and patterns.

The application runs entirely in your browser, checks URL patterns locally, and optionally checks VirusTotal reports. Results cannot guarantee that a URL is safe.

## ✨ Features

- Interactive URL scanning simulation  
- Terminal-style scan output  
- Detection of common phishing indicators:
  - Missing HTTPS
  - IP-based URLs
  - Suspicious keywords
  - Abnormally long URLs
- Clear result classification:
  - No local risk indicators
  - Suspicious
  - Potential Phishing
- Animated background effects
- Dark red themed UI
- No backend; optional direct VirusTotal requests

## 🛠 Tech Stack

- **HTML**
- **CSS**
- **JavaScript**

## 📸 Screenshot
<img width="1157" height="718" alt="image" src="https://github.com/user-attachments/assets/4905c00a-2f17-495d-aef4-5c72b16c7164" />

