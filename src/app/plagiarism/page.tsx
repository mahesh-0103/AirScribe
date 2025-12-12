"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderCircle, ShieldCheck, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the interface to prevent "type" errors
interface PlagiarismResult {
  originalText: string;
  plagiarizedSegments: {
    text: string;
    suggestion: string;
  }[];
  score: number;
}

export default function PlagiarismPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState(""); 
  const [result, setResult] = useState<PlagiarismResult | null>(null);

  const handleCheck = async () => {
    if (text.length < 10) return;
    setIsLoading(true);
    
    try {
      // Connect to your app.py backend
      const response = await fetch("https://kira0103-airscribe-backend.hf.space/api/process-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: "GENERAL_NEWS",
          text: text,
          quality: "High",
          length: "Medium",
          tone: "Professional"
        }),
      });

      const data = await response.json();
      
      // MOCK: Replace with actual backend parsing to get plagiarized segments
      setResult({
        originalText: text,
        plagiarizedSegments: [],
        score: 95
      });
    } catch (error) {
      console.error("API Error:", error);
      // NOTE: The 429 error must be fixed by quota increase or backoff in the backend/action file
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplace = (original: string, replacement: string) => {
    setResult(prev => {
      if (!prev) return null;
      const newText = prev.originalText.replace(original, replacement);
      const newSegments = prev.plagiarizedSegments.filter(s => s.text !== original);
      return { ...prev, originalText: newText, plagiarizedSegments: newSegments };
    });
  };

  const renderResult = () => {
    if (!result) return <p className="text-muted-foreground italic">Analysis results will appear here.</p>;
    
    let lastIndex = 0;
    const parts = [];
    const sortedSegments = [...result.plagiarizedSegments].sort((a, b) => 
      result.originalText.indexOf(a.text) - result.originalText.indexOf(b.text)
    );

    sortedSegments.forEach((segment, i) => {
      const index = result.originalText.indexOf(segment.text, lastIndex);
      if (index > lastIndex) {
        parts.push(result.originalText.substring(lastIndex, index));
      }
      parts.push(
        <TooltipProvider key={i}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="bg-yellow-200/80 underline decoration-red-500 decoration-wavy cursor-pointer rounded-sm px-1">
                {segment.text}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-4 p-2">
                <div>
                  <p className="text-xs text-muted-foreground">Suggestion:</p>
                  <p className="font-semibold">{segment.suggestion}</p>
                </div>
                <Button size="sm" onClick={() => handleReplace(segment.text, segment.suggestion)}>Replace</Button>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      lastIndex = index + segment.text.length;
    });

    if (lastIndex < result.originalText.length) {
      parts.push(result.originalText.substring(lastIndex));
    }
    return <div className="whitespace-pre-wrap leading-relaxed">{parts}</div>;
  };

  return (
    // Grid Container: Set height to 60vh (60% of viewport height)
    <div className="flex-1 p-4 h-[60vh] overflow-hidden bg-muted/30"> 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-stretch">
        
        {/* Input Panel (Left) */}
        <Card className="flex flex-col shadow-xl border-none h-full"> 
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/> Plagiarism Checker</CardTitle>
            <CardDescription>Enter text to identify and remove potential plagiarism.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4"> 
            <Textarea
              placeholder="Paste your content..."
              className="flex-1 resize-none bg-white text-base p-4 min-h-[150px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{text.length.toLocaleString()} / 50,000</span>
              <Button onClick={handleCheck} disabled={isLoading || text.length < 10} size="lg" className="rounded-full">
                {isLoading ? <LoaderCircle className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
                Check Originality
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel (Right) */}
        <Card className="flex flex-col shadow-xl border-none bg-card/80 backdrop-blur-sm h-full"> 
          <CardHeader>
            <CardTitle>Analysis & Suggestions</CardTitle>
            {result && <div className="flex items-center gap-2">Score: <Badge>{result.score}%</Badge></div>}
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto bg-muted/20 rounded-b-xl p-4">
            {isLoading ? (
               <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                 <LoaderCircle className="h-10 w-10 animate-spin text-primary mb-2"/>
                 <p>Comparing with AI patterns...</p>
               </div>
            ) : renderResult()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
    </div>
  );
}
