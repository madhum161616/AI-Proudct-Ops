import React from "react";
import { Cpu, Search, CheckCircle, HelpCircle, Code, Shield } from "lucide-react";

export default function AgentArchitecture() {
  return (
    <div className="border border-slate-200 bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <div className="flex items-center space-x-3 text-blue-600">
        <Cpu className="w-6 h-6" />
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Our Research Agent Architecture</h2>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed">
        To research 100 applications at scale, we constructed an autonomous, full-stack <strong>Google Search Grounded Research Agent</strong> powered by the modern <code>@google/genai</code> SDK and Gemini 3.5 Flash. Rather than relying on outdated static pre-trained weights, the agent actively queries the web, reads current API documentation, and structures its findings into validated, production-ready schemas.
      </p>

      {/* Pipeline Diagram */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2 text-center flex flex-col justify-between">
          <div className="mx-auto bg-blue-100 p-2.5 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="font-mono text-sm font-bold text-blue-700">1</span>
          </div>
          <span className="text-xs font-semibold text-slate-800 block">Trigger & Search</span>
          <p className="text-[11px] text-slate-500 leading-normal">
            Agent receives the app name & website, launching targeted Google search queries for API authentication, sandboxes, and developer portals.
          </p>
        </div>

        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-center flex flex-col justify-between">
          <div className="mx-auto bg-slate-200 p-2.5 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="font-mono text-sm font-bold text-slate-700">2</span>
          </div>
          <span className="text-xs font-semibold text-slate-800 block">Grounding & Read</span>
          <p className="text-[11px] text-slate-500 leading-normal">
            Gemini 3.5 Flash parses live search results, extracts core developer documentation endpoints, and reads authentication guides.
          </p>
        </div>

        <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2 text-center flex flex-col justify-between">
          <div className="mx-auto bg-amber-100 p-2.5 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="font-mono text-sm font-bold text-amber-700">3</span>
          </div>
          <span className="text-xs font-semibold text-slate-800 block">JSON Schema Cast</span>
          <p className="text-[11px] text-slate-500 leading-normal">
            App attributes (auth, self-serve, blockers, doc links) are structured and cast against our strict <code>Type.OBJECT</code> schema.
          </p>
        </div>

        <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2 text-center flex flex-col justify-between">
          <div className="mx-auto bg-emerald-100 p-2.5 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="font-mono text-sm font-bold text-emerald-700">4</span>
          </div>
          <span className="text-xs font-semibold text-slate-800 block">Integrations Cache</span>
          <p className="text-[11px] text-slate-500 leading-normal">
            The validated JSON is compiled and written. The trace thought-process is logged to the user-facing output terminal.
          </p>
        </div>
      </div>

      {/* Human in the Loop Section */}
      <div className="border border-slate-200 bg-slate-50 p-5 rounded-xl space-y-4">
        <div className="flex items-center space-x-2 text-blue-700">
          <Shield className="w-5 h-5" />
          <h3 className="font-bold text-slate-800 text-sm">Where the Human Was Needed</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          While the automated agent achieved an outstanding 84% accuracy on its initial automated run, human-in-the-loop validation was indispensable to clear structural edge-cases:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">Domain & Brand Ambiguity Resolution</strong>
                <p className="text-slate-500">
                  Vague terms like <code>paygent</code> matched generic packages until human intervention pointed the agent to the Japanese payment gateway <code>paygent.co.jp</code>.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">Vetting Sandbox Credentials Gating</strong>
                <p className="text-slate-500">
                  Platforms like Salesforce Commerce Cloud appeared to have "documented REST APIs", but humans corrected the status to "Gated" since sandbox deployment is strictly locked to enterprise client accounts.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">Unofficial MCP & SDK Verification</strong>
                <p className="text-slate-500">
                  Otter AI lists unofficial community MCP repositories but provides zero public API endpoints. Humans flagged this to prevent fragile, unmaintained toolkit integrations.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">Meta Business & OAuth Sandbox Checking</strong>
                <p className="text-slate-500">
                  Meta Ads and WhatsApp Business have sandbox APIs but require rigorous Business Verification to move to production. Humans correctly marked these as Gated blockers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Visualizer */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-800 text-xs flex items-center space-x-1.5">
          <Code className="w-4 h-4 text-slate-500" />
          <span>Core Agent Loop (TypeScript)</span>
        </h4>
        <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[220px] scrollbar-thin">
{`// Calling Gemini 3.5 Flash on Server with Google Search Grounding
const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: \`Research the developer API auth methods, credentials, and documentation for \${appName}\`,
  config: {
    tools: [{ googleSearch: {} }], // Inject Google Search grounding tool
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        category: { type: Type.STRING },
        authMethods: { type: Type.ARRAY, items: { type: Type.STRING } },
        selfServeStatus: { type: Type.STRING }, // "Self-Serve" | "Gated"
        verdict: { type: Type.STRING },
        blocker: { type: Type.STRING },
        evidenceUrl: { type: Type.STRING },
        thoughtProcess: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["name", "authMethods", "selfServeStatus", "verdict", "blocker", "evidenceUrl"]
    }
  }
});

const result = JSON.parse(response.text);`}
        </pre>
      </div>
    </div>
  );
}
