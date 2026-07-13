# Composio Application Technical Integrations Research Case Study

This repository contains an interactive **Technical Research & Verification Portal** built for analyzing **100 SaaS applications** across 10 business verticals to assess their integration suitability with **Composio**. 

The system operates both in a fully offline high-fidelity **Heuristic Simulation Mode** and a live **GenAI Web Research Agent Mode** using Google Gemini, showcasing automated validation alongside honest human-in-the-loop audit logs.

## 🔗 Live Application Links

- **Interactive Portal (Production):** https://ai-proudct-ops.netlify.app/

---

## 🎯 Case Study Deliverable Overview

The web dashboard functions as a **single, self-explanatory case study page** designed to be understood by a reviewer in under **two minutes** without narration. It includes:

1. **PLAINLY STATED PATTERNS (The Headline):** An interactive executive summary demonstrating that **82% of evaluated applications** are highly buildable, while classifying the specific auth requirements (OAuth2 vs. API Key) and enterprise hurdles (Paid/Gated).
2. **CLEAN SKIMMABLE FINDINGS (The Matrix):** A fully searchable, filterable, and expandable database table of all 100 applications, complete with a CSV export mechanism for offline data analysis.
3. **THE AGENT WORKFLOW (What was Built):** An architectural flow diagram displaying the multi-step verification sequence (Search, Indexing, Auth Extraction, Credential Gating, Verdict Evaluation).
4. **THE PROOF (Interactive Sandbox Trigger):** A runnable research agent playground that allows you to input any App Name and Website to trigger local validation simulations or a live Web Agent query with Gemini.
5. **THE VERIFICATION (Honest Hit & Miss Audit):** Clear documentation checking the AI research accuracy, showcasing where the agent succeeded and where human adjustments were necessary.

---

## 🚀 Running the Project Locally

### 1. Install Dependencies
Ensure you have Node.js installed on your machine.
```bash
npm install
```

### 2. Configure Environment Variables (For Live Mode)
Create a `.env` file in the root directory (using `.env.example` as a template) and supply your Gemini API Key if you want to use the Live API Mode.
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*Note: If no API key is specified, you can still run the Sandbox in the default **Simulated Data** mode, which behaves with zero external dependencies.*

### 3. Run the Development Server
This boots up the Express backend + Vite frontend on port **3000**.
```bash
npm run dev
```
Open your browser to `http://localhost:3000` to interact with the full dashboard and run the agent!

### 4. Build and Run in Production Mode
```bash
npm run build
npm start
```

---

## 🛠️ Architecture & Technical Scope

- **Frontend:** React, Tailwind CSS, Recharts for dynamic visual statistics, and Lucide React icons.
- **Backend:** Node.js Express server (`server.ts`) hosting custom API routing.
- **GenAI Integration:** Utilizes the official `@google/genai` SDK with the Google Search Tool (Grounding) enabled for high-fidelity SaaS research in live mode.
- **CSV Exporter:** Standard client-side parser to download full spreadsheet findings.
- **Print Stylesheet:** Custom CSS `@media print` query that outputs a beautifully formatted, minimalist case-study document on paper or PDF.
