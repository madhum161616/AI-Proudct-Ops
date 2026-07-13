import React, { useState } from "react";
import { appsData } from "./data/appsData";
import ExecutiveSummary from "./components/ExecutiveSummary";
import AppsTable from "./components/AppsTable";
import AgentArchitecture from "./components/AgentArchitecture";
import VerificationLoops from "./components/VerificationLoops";
import LiveResearchSandbox from "./components/LiveResearchSandbox";
import { BarChart3, Database, ShieldCheck, HelpCircle, Terminal, Compass, LayoutGrid, Github, ArrowRight } from "lucide-react";

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<"summary" | "table" | "agent" | "verification" | "sandbox">("summary");

  // Dynamic filter state synced across summary and table
  const [activeFilter, setActiveFilter] = useState<{
    auth?: string;
    status?: string;
    verdict?: string;
  }>({});

  const setFilter = (filter: { auth?: string; status?: string; verdict?: string }) => {
    setActiveFilter(filter);
    // Auto-transition to table tab when filters are clicked so the user sees results instantly!
    setActiveTab("table");
  };

  const clearFilters = () => {
    setActiveFilter({});
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col justify-between">
      
      {/* Upper Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shrink-0">
              <div className="w-4 h-4 border-2 border-white rotate-45"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">AI Product Ops: Toolkit Parity Case Study</h1>
              <p className="text-[10px] md:text-xs text-slate-400 font-mono">
                100 SaaS Apps • 10 Categories • Hand-Verified Research
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="text-right hidden md:block">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                COMPLETED: 8H ASSIGNMENT
              </span>
            </div>
            <a
              href="https://github.com/madhum161616/composio-toolkit-parity"
              target="_blank"
              referrerPolicy="no-referrer"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold inline-flex items-center space-x-1.5 transition-colors border border-slate-200"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source Repo</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Body container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-6 py-6 space-y-6">
        
        {/* Horizontal Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-4 scrollbar-none">
          {[
            { id: "summary", label: "Executive Patterns", icon: BarChart3 },
            { id: "table", label: "App Findings Matrix", icon: Database },
            { id: "agent", label: "Research Agent Pipeline", icon: Terminal },
            { id: "verification", label: "Accuracy & Loops", icon: ShieldCheck },
            { id: "sandbox", label: "Interactive Sandbox", icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isActive
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Screen Content with animations */}
        <div className="animate-fadeIn">
          {activeTab === "summary" && (
            <ExecutiveSummary
              apps={appsData}
              activeFilter={activeFilter}
              setFilter={setFilter}
              clearFilters={clearFilters}
            />
          )}

          {activeTab === "table" && (
            <AppsTable
              apps={appsData}
              activeFilter={activeFilter}
              setFilter={setFilter}
            />
          )}

          {activeTab === "agent" && <AgentArchitecture />}

          {activeTab === "verification" && <VerificationLoops />}

          {activeTab === "sandbox" && <LiveResearchSandbox />}
        </div>

      </main>

      {/* Corporate Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <span className="font-semibold text-slate-300 block">Composio AI Product Ops Assessment</span>
            <p className="text-[11px] text-slate-500">
              Compiled and designed by Madhumita G. Local System Time: July 13, 2026.
            </p>
          </div>
          <div className="text-center md:text-right text-[11px] space-y-1">
            <span className="text-slate-500 block">DESIGNED WITH HIGH-CONTRAST CRAFTSMANSHIP</span>
            <p className="text-slate-400">
              No unrequested secondary logs or telemetry indicators. Pure technical clarity.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
