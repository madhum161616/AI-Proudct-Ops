import React, { useState, useMemo } from "react";
import { AppRecord } from "../types";
import { Search, ExternalLink, ChevronDown, ChevronUp, Link2, Info, Check, Filter, Download, Copy } from "lucide-react";

interface AppsTableProps {
  apps: AppRecord[];
  activeFilter: {
    auth?: string;
    status?: string;
    verdict?: string;
  };
  setFilter: (filter: { auth?: string; status?: string; verdict?: string }) => void;
}

export default function AppsTable({ apps, activeFilter, setFilter }: AppsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [copiedAppId, setCopiedAppId] = useState<number | null>(null);

  const handleCopyUrl = (id: number, url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedAppId(id);
    setTimeout(() => {
      setCopiedAppId(null);
    }, 2000);
  };

  // Get unique categories for filter tabs
  const categories = useMemo(() => {
    const cats = new Set(apps.map((app) => app.category));
    return ["All", ...Array.from(cats)];
  }, [apps]);

  // Filter & Search Logic
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // 1. Text Search match (filtering by name, category, or verdict as well as website, blocker, description)
      const textMatch =
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.verdict.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.blocker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Category Tab match
      const categoryMatch = selectedCategory === "All" || app.category === selectedCategory;

      // 3. Auth Method match (from Executive summary click)
      const authMatch = !activeFilter.auth || app.authMethods.includes(activeFilter.auth);

      // 4. Self-serve status match (from Executive summary click)
      const statusMatch = !activeFilter.status || app.selfServeStatus === activeFilter.status;

      // 5. Verdict match (from Executive summary click)
      const verdictMatch = !activeFilter.verdict || app.verdict === activeFilter.verdict;

      return textMatch && categoryMatch && authMatch && statusMatch && verdictMatch;
    });
  }, [apps, searchTerm, selectedCategory, activeFilter]);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const downloadCSV = () => {
    // Columns to export
    const headers = [
      "ID",
      "Name",
      "Website",
      "Category",
      "Description",
      "Auth Methods",
      "Developer Access Status",
      "Developer Access Detail",
      "API Surface",
      "API Breadth",
      "MCP Status",
      "Composio Verdict",
      "Blocker Detail",
      "Docs Reference URL"
    ];

    // Convert rows to CSV rows
    const rows = filteredApps.map((app) => [
      app.id,
      app.name,
      app.website,
      app.category,
      app.description,
      app.authMethods.join("; "),
      app.selfServeStatus,
      app.selfServeDetail,
      app.apiSurface,
      app.apiBreadth,
      app.mcpStatus,
      app.verdict,
      app.blocker,
      app.evidenceUrl
    ]);

    // Format fields (wrap strings with double quotes, escape existing double quotes)
    const csvContent = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(","),
      ...rows.map(row =>
        row.map(field => {
          const val = field === undefined || field === null ? "" : String(field);
          return `"${val.replace(/"/g, '""')}"`;
        }).join(",")
      )
    ].join("\n");

    // Trigger standard browser download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `composio_apps_research_findings_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border border-slate-100 bg-white rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="font-semibold text-slate-800 text-base flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span>App Research Matrix & Findings</span>
          </h3>
          <p className="text-xs text-slate-500">
            Showing {filteredApps.length} of {apps.length} researched applications. Expand a row for exact developer credentials detail.
          </p>
        </div>

        {/* Search Bar & Export CSV */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative max-w-sm w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search app, category, verdict..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Active Sync Filter Indicator Banner */}
      {(activeFilter.auth || activeFilter.status || activeFilter.verdict) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl gap-3 animate-fadeIn">
          <div className="flex flex-wrap items-center gap-2 text-xs text-blue-800">
            <span className="font-semibold text-blue-900">Active Sync Filter:</span>
            {activeFilter.auth && (
              <span className="bg-white border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold font-mono text-[10px] text-blue-700 shadow-sm">
                Auth: {activeFilter.auth}
              </span>
            )}
            {activeFilter.status && (
              <span className="bg-white border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold font-mono text-[10px] text-blue-700 shadow-sm">
                Access: {activeFilter.status}
              </span>
            )}
            {activeFilter.verdict && (
              <span className="bg-white border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold font-mono text-[10px] text-blue-700 shadow-sm">
                Verdict: {activeFilter.verdict}
              </span>
            )}
          </div>
          <button
            onClick={() => setFilter({})}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer hover:no-underline transition-colors shrink-0"
          >
            Clear active filters & show all 100 apps
          </button>
        </div>
      )}

      {/* Categories Horizontal Tabs scrollable */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-slate-100">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              if (cat === "All") {
                setFilter({});
              }
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Responsive Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Application</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Auth Methods</th>
              <th className="py-3 px-4 text-center">Developer Access</th>
              <th className="py-3 px-4 text-center">Verdict</th>
              <th className="py-3 px-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => {
                const isExpanded = expandedRow === app.id;
                
                // Color mapping for Status
                let statusBadgeColor = "bg-slate-100 text-slate-600 border-slate-200";
                if (app.selfServeStatus === "Self-Serve") statusBadgeColor = "bg-teal-50 text-teal-700 border-teal-100";
                if (app.selfServeStatus === "Gated") statusBadgeColor = "bg-rose-50 text-rose-700 border-rose-100";
                if (app.selfServeStatus === "Paid-Only") statusBadgeColor = "bg-amber-50 text-amber-700 border-amber-100";

                // Color mapping for Verdict
                let verdictBadgeColor = "bg-slate-100 text-slate-600 border-slate-200";
                if (app.verdict === "High") verdictBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                if (app.verdict === "Medium") verdictBadgeColor = "bg-amber-50 text-amber-700 border-amber-100";
                if (app.verdict === "Low") verdictBadgeColor = "bg-rose-50 text-rose-700 border-rose-100";

                return (
                  <React.Fragment key={app.id}>
                    {/* Primary Row */}
                    <tr
                      onClick={() => toggleRow(app.id)}
                      className={`hover:bg-white hover:scale-[1.005] hover:shadow-md relative hover:z-10 cursor-pointer transition-all duration-200 ${
                        isExpanded ? "bg-slate-50/30" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-slate-400 text-center">{app.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-sm">{app.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono flex items-center mt-0.5">
                            <Link2 className="w-3 h-3 mr-1 inline-block" />
                            {app.website}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{app.category}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {app.authMethods.map((auth, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-100 border border-slate-200/50 rounded-md text-[10px] font-mono text-slate-600 font-medium"
                            >
                              {auth}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadgeColor}`}>
                          {app.selfServeStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${verdictBadgeColor}`}>
                          {app.verdict}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-slate-400 hover:text-slate-600">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Detail Section */}
                    {isExpanded && (
                      <tr className="bg-slate-50/20">
                        <td colSpan={7} className="p-0">
                          <div className="px-6 py-5 bg-slate-50/50 border-t border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 animate-fadeIn">
                            
                            {/* Left Box: Overview */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">Functional Description</h4>
                                <p className="text-slate-700 text-xs leading-relaxed">{app.description}</p>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">Developer Credentials Path</h4>
                                <p className="text-slate-700 text-xs leading-relaxed">{app.selfServeDetail}</p>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">Evidence Documentation Link</h4>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                                  <a
                                    href={app.evidenceUrl}
                                    target="_blank"
                                    referrerPolicy="no-referrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline font-mono text-[11px] truncate max-w-xs sm:max-w-md inline-flex items-center"
                                  >
                                    <span>{app.evidenceUrl}</span>
                                    <ExternalLink className="w-3.5 h-3.5 ml-1 inline shrink-0" />
                                  </a>
                                  <button
                                    onClick={(e) => handleCopyUrl(app.id, app.evidenceUrl, e)}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-md text-[10px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer w-fit shrink-0"
                                  >
                                    {copiedAppId === app.id ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-600 animate-scaleIn" />
                                        <span className="text-emerald-700 font-medium">Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy URL</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Right Box: API Details */}
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">API Surface Structure</h4>
                                  <p className="text-slate-700 text-xs">{app.apiSurface}</p>
                                </div>
                                <div>
                                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">API Breadth</h4>
                                  <span className="text-xs font-semibold text-slate-800">{app.apiBreadth}</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">MCP Integration</h4>
                                  <span className={`inline-flex items-center text-xs font-semibold ${
                                    app.mcpStatus === "Yes" ? "text-emerald-600" : app.mcpStatus === "Unofficial" ? "text-amber-600" : "text-slate-500"
                                  }`}>
                                    {app.mcpStatus === "Yes" ? "Official MCP Server Available" : app.mcpStatus === "Unofficial" ? "Community/Unofficial MCP" : "No MCP Server"}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">Composio Toolkit Readiness</h4>
                                  <span className={`inline-flex items-center text-xs font-semibold ${
                                    app.verdict === "High" ? "text-emerald-600" : app.verdict === "Medium" ? "text-amber-600" : "text-rose-600"
                                  }`}>
                                    {app.verdict === "High" ? "High Readiness" : app.verdict === "Medium" ? "Medium Friction" : "Low Readiness"}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">Verdict & Blocker Detail</h4>
                                <p className="text-slate-700 text-xs bg-white border p-2.5 rounded-lg border-slate-150 leading-relaxed font-mono text-[11px]">
                                  {app.blocker}
                                </p>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Info className="w-8 h-8 text-slate-300" />
                    <p className="font-medium text-slate-600">No applications matched your search filters</p>
                    <p className="text-[11px]">Try adjusting your search criteria or clear active summary filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
