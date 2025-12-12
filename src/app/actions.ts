"use server";

import type { ProcessRequestData, ProcessedResult } from "@/lib/types";

const API_PROCESS_URL = "https://kira0103-airscribe-backend.hf.space/api/process-ai";
const KEYWORDS_DELIMITER = "[KEYWORDS]";
const BART_DRAFT_DELIMITER = "[BART_DRAFT]";

// This function will parse the complex string from the API
function parseApiResponse(apiResponse: string): { geminiSummary: string; keywords: string[]; bartSummary: string, essence: string } {
  let geminiContent: string;
  let bartSummary: string = "Intermediate analysis not available in this response.";

  if (apiResponse.includes(BART_DRAFT_DELIMITER)) {
    const parts = apiResponse.split(BART_DRAFT_DELIMITER);
    geminiContent = parts[0];
    bartSummary = parts[1] || bartSummary;
  } else {
    geminiContent = apiResponse;
  }

  let geminiSummary: string;
  let keywords: string[] = [];
  
  if (geminiContent.includes(KEYWORDS_DELIMITER)) {
    const parts = geminiContent.split(KEYWORDS_DELIMITER);
    geminiSummary = parts[0].trim();
    if (parts[1]) {
      keywords = parts[1].split(',').map(kw => kw.trim()).filter(Boolean);
    }
  } else {
    geminiSummary = geminiContent.trim();
  }

  // Extract first sentence as essence
  const sentences = geminiSummary.match(/[^.!?]+[.!?]+/g) || [geminiSummary];
  const essence = sentences[0] || geminiSummary.substring(0, 100);

  return { geminiSummary, keywords, bartSummary: bartSummary.trim(), essence: essence.trim() };
}


export async function processText(data: ProcessRequestData): Promise<ProcessedResult | { error: string }> {
  try {
    const response = await fetch(API_PROCESS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: data.text,
        tone: data.tone,
        quality: data.quality,
        length: data.length,
        domain: data.domain,
      }),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ detail: "The AI server returned an unreadable error." }));
        const errorMessage = errorBody.detail || `API Error: ${response.status}`;
        console.error("API Error:", errorMessage);
        return { error: errorMessage };
    }

    const result = await response.json();
    const rawOutput = result.output;

    if (typeof rawOutput !== 'string') {
      console.error("Invalid API response format", result);
      return { error: "Invalid API response format. Expected a string in the 'output' field." };
    }

    const { geminiSummary, keywords, bartSummary, essence } = parseApiResponse(rawOutput);

    return {
      geminiSummary,
      bartSummary,
      keywords,
      essence,
    };
  } catch (error) {
    console.error("Processing failed:", error);
    if (error instanceof Error) {
      return { error: `A network error occurred: ${error.message}` };
    }
    return { error: "An unknown error occurred during processing." };
  }
}
