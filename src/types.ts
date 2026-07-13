export interface AppRecord {
  id: number;
  name: string;
  website: string;
  category: string;
  description: string;
  authMethods: string[];
  selfServeStatus: 'Self-Serve' | 'Gated' | 'Paid-Only' | 'No-API';
  selfServeDetail: string;
  apiSurface: string;
  apiBreadth: 'Extremely Broad' | 'Broad' | 'Medium-Broad' | 'Medium' | 'Thin-Medium' | 'Thin' | 'None';
  mcpStatus: 'Yes' | 'No' | 'Unofficial';
  verdict: 'High' | 'Medium' | 'Low';
  blocker: string;
  evidenceUrl: string;
}

export interface ResearchResult {
  name: string;
  category: string;
  description: string;
  authMethods: string[];
  selfServeStatus: 'Self-Serve' | 'Gated' | 'Paid-Only' | 'No-API';
  selfServeDetail: string;
  apiSurface: string;
  apiBreadth: 'Extremely Broad' | 'Broad' | 'Medium-Broad' | 'Medium' | 'Thin-Medium' | 'Thin' | 'None';
  mcpStatus: 'Yes' | 'No' | 'Unofficial';
  verdict: 'High' | 'Medium' | 'Low';
  blocker: string;
  evidenceUrl: string;
  thoughtProcess: string[];
  simulated?: boolean;
}
