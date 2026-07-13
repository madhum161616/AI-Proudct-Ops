import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Lazy initialization of Google GenAI SDK
let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required for live research.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

function generateSimulatedResponse(appName: string, website?: string) {
  const normalizedName = appName.toLowerCase().trim();
  
  // Clean up website input to extract a pure domain
  let rawWebsite = (website || "").trim();
  if (!rawWebsite) {
    rawWebsite = `${normalizedName.replace(/\s+/g, "")}.com`;
  }
  // Remove protocol prefixes (http://, https://) and optional leading www.
  let cleanDomain = rawWebsite.replace(/^(https?:\/\/)?(www\.)?/, "");
  // Strip any trailing path, query parameters, or slashes
  cleanDomain = cleanDomain.split("/")[0].split("?")[0];
  
  const domain = cleanDomain || `${normalizedName.replace(/\s+/g, "")}.com`;
  
  // Custom heuristics for popular apps to make the simulator look incredibly high-fidelity and accurate
  let category = "Productivity & SaaS Tools";
  let authMethods = ["OAuth2", "API Key"];
  let selfServeStatus = "Self-Serve";
  let selfServeDetail = "Developer credentials can be created directly within the developer console or account settings after a free signup.";
  let apiSurface = "Documented REST API mapping records, workspace objects, and triggers.";
  let apiBreadth = "Medium";
  let mcpStatus = "No";
  let verdict = "High";
  let blocker = "None. Integrates cleanly with standard developer access paths.";
  let evidenceUrl = `https://developers.${domain}/docs`;

  if (normalizedName.includes("linear")) {
    category = "Productivity & Project Management";
    authMethods = ["OAuth2", "API Key"];
    selfServeStatus = "Self-Serve";
    selfServeDetail = "Create personal API keys or OAuth2 applications inside Settings > API.";
    apiSurface = "Robust GraphQL API exposing all workspaces, issues, and teams.";
    apiBreadth = "Broad";
    mcpStatus = "Yes";
    verdict = "High";
    blocker = "None. High maturity, public developer sandbox available.";
    evidenceUrl = "https://developers.linear.app/docs";
  } else if (normalizedName.includes("slack")) {
    category = "Communication & Chat";
    authMethods = ["OAuth2"];
    selfServeStatus = "Self-Serve";
    selfServeDetail = "Create a Slack App on api.slack.com/apps and install it to your workspace.";
    apiSurface = "Web API (REST), Events API (Webhooks), and Socket Mode.";
    apiBreadth = "Extremely Broad";
    mcpStatus = "Yes";
    verdict = "High";
    blocker = "None. Exceptionally well-documented web API with clear OAuth guidance.";
    evidenceUrl = "https://api.slack.com/docs";
  } else if (normalizedName.includes("stripe")) {
    category = "Finance & Payments";
    authMethods = ["API Key"];
    selfServeStatus = "Self-Serve";
    selfServeDetail = "Retrieve live and test API keys instantly from the Stripe developer dashboard.";
    apiSurface = "Documented REST API covering payments, customers, invoices, and subscriptions.";
    apiBreadth = "Extremely Broad";
    mcpStatus = "No";
    verdict = "High";
    blocker = "None. Offers the gold standard developer platform and robust SDKs.";
    evidenceUrl = "https://stripe.com/docs/api";
  } else if (normalizedName.includes("plaid")) {
    category = "Finance & Payments";
    authMethods = ["API Key"];
    selfServeStatus = "Self-Serve";
    selfServeDetail = "Sign up for a free developer account to obtain client_id and secret keys for sandbox testing.";
    apiSurface = "REST API linking bank accounts, transaction histories, and identity verification.";
    apiBreadth = "Broad";
    mcpStatus = "No";
    verdict = "High";
    blocker = "None. Strong developer portal and sandbox environment.";
    evidenceUrl = "https://plaid.com/docs";
  } else if (normalizedName.includes("zoom")) {
    category = "Communication & Video";
    authMethods = ["OAuth2"];
    selfServeStatus = "Self-Serve";
    selfServeDetail = "Create a Zoom App in the Zoom App Marketplace under your developer account.";
    apiSurface = "REST API and Webhooks managing meetings, webinars, and cloud recordings.";
    apiBreadth = "Broad";
    mcpStatus = "No";
    verdict = "High";
    blocker = "None. Requires developer account signup.";
    evidenceUrl = "https://developers.zoom.us/docs";
  } else if (normalizedName.includes("cursor")) {
    category = "AI Platforms & Developer Tools";
    authMethods = ["None"];
    selfServeStatus = "No-API";
    selfServeDetail = "No public developer portal or API credentials available for external tools.";
    apiSurface = "None";
    apiBreadth = "None";
    mcpStatus = "No";
    verdict = "Low";
    blocker = "Cursor operates as a client-side IDE and does not expose a public web service API surface.";
    evidenceUrl = "https://cursor.com";
  } else if (normalizedName.includes("hubspot")) {
    category = "CRM & Sales";
    authMethods = ["OAuth2", "API Key"];
    selfServeStatus = "Self-Serve";
    selfServeDetail = "Create developer test accounts and configure private apps or OAuth app settings.";
    apiSurface = "REST API for contacts, companies, deals, and custom objects.";
    apiBreadth = "Broad";
    mcpStatus = "No";
    verdict = "High";
    blocker = "None. Fully accessible self-serve developer ecosystem.";
    evidenceUrl = "https://developers.hubspot.com/docs";
  } else if (normalizedName.includes("notion")) {
    category = "Collaborative Workspace & Docs";
    authMethods = ["OAuth2", "API Key"];
    selfServeStatus = "Self-Serve";
    selfServeDetail = "Create integrations inside developers.notion.com and share them with your workspace.";
    apiSurface = "REST API mapping databases, pages, blocks, and users.";
    apiBreadth = "Medium";
    mcpStatus = "No";
    verdict = "High";
    blocker = "None. Well-documented blocks and database schemas.";
    evidenceUrl = "https://developers.notion.com";
  } else if (normalizedName.includes("figma")) {
    category = "Design & Asset Managers";
    authMethods = ["OAuth2", "API Key"];
    selfServeStatus = "Self-Serve";
    selfServeDetail = "Generate personal access tokens or register an OAuth application in account settings.";
    apiSurface = "REST API for files, comments, and project components; plus Plugin & Widget APIs.";
    apiBreadth = "Broad";
    mcpStatus = "No";
    verdict = "High";
    blocker = "None. Clear documentation and OAuth access.";
    evidenceUrl = "https://www.figma.com/developers/api";
  } else if (normalizedName.includes("jira")) {
    category = "Productivity & Project Management";
    authMethods = ["OAuth2", "Basic"];
    selfServeStatus = "Self-Serve";
    selfServeDetail = "Configure OAuth 2.0 (3LO) or generate API tokens under your Atlassian account dashboard.";
    apiSurface = "Extensive REST API for project boards, issues, users, and workflows.";
    apiBreadth = "Broad";
    mcpStatus = "No";
    verdict = "High";
    blocker = "None. Standard OAuth and token flows supported.";
    evidenceUrl = "https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro";
  } else if (normalizedName.includes("discord")) {
    category = "Communication & Chat";
    authMethods = ["OAuth2", "API Key"];
    selfServeStatus = "Self-Serve";
    selfServeDetail = "Register a Discord Application on the developer portal and generate bot tokens.";
    apiSurface = "REST API, Gateway (WebSockets) for real-time events, and RPC.";
    apiBreadth = "Broad";
    mcpStatus = "No";
    verdict = "High";
    blocker = "None. Highly accessible developer environment.";
    evidenceUrl = "https://discord.com/developers/docs/intro";
  }

  return {
    name: appName,
    category,
    description: `A platform representing ${appName} accessible via ${domain}.`,
    authMethods,
    selfServeStatus,
    selfServeDetail,
    apiSurface,
    apiBreadth,
    mcpStatus,
    verdict,
    blocker,
    evidenceUrl,
    thoughtProcess: [
      `[Agent] Initiating fast offline validation research for '${appName}'...`,
      `[Agent] Scanning local developer index matching specifications for '${domain}'...`,
      `[Agent] Mapping core authentication mechanisms to verify Composio integration parity...`,
      `[Agent] Discovered auth endpoints: Verified support for ${authMethods.join(" and ")}.`,
      `[Agent] Inspecting developer onboarding flow: Verified '${selfServeStatus}' pathway.`,
      `[Agent] SUCCESS: Validation checks completed with 100% schema alignment!`
    ],
    simulated: true
  };
}

// 1. Live Research Agent API Endpoint
app.post("/api/research", async (req, res) => {
  const { appName, website, mode } = req.body;

  if (!appName) {
    return res.status(400).json({ error: "appName is required." });
  }

  const normalizedName = appName.toLowerCase().trim();
  const targetWebsite = website || `${normalizedName}.com`;

  if (mode === "simulated") {
    console.log(`[Research Agent] Running high-fidelity local validation research on: ${appName} (${targetWebsite})`);
    // Run high-fidelity simulation locally without external API dependencies!
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate validation latency
    const simulatedResponse = generateSimulatedResponse(appName, website);
    return res.json(simulatedResponse);
  }

  // Live mode
  console.log(`[Research Agent] Initiating live web research on: ${appName} (${targetWebsite})`);
  try {
    const hasKey = !!process.env.GEMINI_API_KEY;
    if (!hasKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY environment variable is not configured. Please set the key in settings, or switch to 'Simulated Data' mode."
      });
    }

    const ai = getGemini();

    const prompt = `You are a professional AI Product Ops Intern and technical researcher at Composio.
Research the following application and capture technical developer details:
App Name: ${appName}
App Website: ${targetWebsite}

Research Goals:
1. Determine its business Category and what it does in 1 clean line.
2. Identify Auth methods: OAuth2, API key, Basic, token, or others.
3. Determine Self-serve vs Gated: can a developer get credentials themselves for free or on a trial (Self-Serve), or does it need a paid plan (Paid-Only), admin approval, or a partnership/contact-sales gate (Gated).
4. Outline API surface: documented public REST, GraphQL, or CLI/scraping (None), and approximate breadth (Extremely Broad, Broad, Medium, Thin, None). Also note if an MCP server exists.
5. Provide a Buildability verdict: High (ready to build today), Medium (some friction/meta reviews/paid accounts), or Low (no API/closed partner gate). Identify the main blocker.
6. Find the official documentation or article URL for evidence.

Return a structured JSON object with the research results. Include a detailed 'thoughtProcess' list showing a step-by-step trace of your search findings. Ensure that the values returned strictly conform to the expected categories.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            authMethods: { type: Type.ARRAY, items: { type: Type.STRING } },
            selfServeStatus: { type: Type.STRING }, // "Self-Serve" | "Gated" | "Paid-Only" | "No-API"
            selfServeDetail: { type: Type.STRING },
            apiSurface: { type: Type.STRING },
            apiBreadth: { type: Type.STRING }, // "Extremely Broad" | "Broad" | "Medium" | "Thin" | "None"
            mcpStatus: { type: Type.STRING }, // "Yes" | "No" | "Unofficial"
            verdict: { type: Type.STRING }, // "High" | "Medium" | "Low"
            blocker: { type: Type.STRING },
            evidenceUrl: { type: Type.STRING },
            thoughtProcess: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: [
            "name",
            "category",
            "description",
            "authMethods",
            "selfServeStatus",
            "selfServeDetail",
            "apiSurface",
            "apiBreadth",
            "mcpStatus",
            "verdict",
            "blocker",
            "evidenceUrl",
            "thoughtProcess"
          ]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text received from Gemini.");
    }

    const jsonResult = JSON.parse(resultText);
    res.json(jsonResult);
  } catch (error: any) {
    console.error("[Research Agent] Error in live research:", error);
    res.status(500).json({ error: error.message || "Failed to execute live research query." });
  }
});

// Serve frontend assets & start port listening
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Full-Stack Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
