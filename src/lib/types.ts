export type Domain = "GENERAL_NEWS" | "RESEARCH_PAPER";
export type Tone = "Professional" | "Creative" | "Concise";
export type Quality = "Standard" | "High Quality";
export type Length = "Short" | "Medium" | "Long";


export interface ProcessRequestData {
  text: string;
  domain: Domain;
  tone: Tone;
  quality: Quality;
  length: Length;
}

export interface ProcessedResult {
  geminiSummary: string;
  bartSummary: string;
  keywords: string[];
  essence: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  request: ProcessRequestData;
  result: ProcessedResult;
}
