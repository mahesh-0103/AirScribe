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

// Define the structure for the API result
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
  // Dummy text removed: Initialized to empty string
  const [text, setText] = useState(""); 
  const [result, setResult] = useState<PlagiarismResult | null>(null);

  const charCount = text.length;

  const handleCheck = async () => {
    if (text.length < 10) return;
    
    setIsLoading(true);
    setResult(null);

    try {
        // REPLACE THIS: Actual API call to your backend
        // const response = await fetch('https://your-backend.hf.space/api/plagiarism', {
        //     method: 'POST',
        //     body: JSON.stringify({ text }),
        //     headers: { 'Content-Type': 'application/json' }
        // });
        // const data = await response.json();
        // setResult(data);
        
        // TEMPORARY: Empty simulation for UI testing
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    } catch (error) {
        console.error("Failed to check plagiarism:", error);
        setIsLoading(false);
    }
  };
  
  const handleReplace = (original: string, replacement: string) => {
    setResult(prev => {
        if (!prev) return null;
        const newText = prev.originalText.replace(original, replacement);
        const newSegments = prev.plagiarizedSegments.filter(s => s.text !== original);
        return {
            ...prev,
            originalText: newText,
            plagiarizedSegments: newSegments
        }
    })
  }

  const renderResult = () => {
    if (!result) {
        return <p className="text-muted-foreground italic">The processed text with highlights will appear here after analysis.</p>;
    }
    
    let lastIndex = 0;
    const parts = [];

    const sortedSegments = [...result.plagiarizedSegments].sort(
        (a, b) => result.originalText.indexOf(a.text) - result.originalText.indexOf(b.text)
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
                    <span className="bg-yellow-200/80 underline decoration-red-500 decoration-wavy underline-offset-2 cursor-pointer rounded-sm px-1 hover:bg-yellow-300/90 transition-colors">
                        {segment.text}
                    </span>
                </TooltipTrigger>
                <TooltipContent className="bg-background border-primary shadow-lg">
                    <div className="flex items-center gap-4 p-2">
                       <div>
                         <p className="text-xs text-muted-foreground">Suggested Replacement:</p>
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
  }

  return (
    <div className="flex-1 p-4 md:p-6 bg-muted/30">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-start">
        {/* Input Panel */}
        <Card className="h-full flex flex-col shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-3">
              <ShieldCheck className="text-primary"/> Plagiarism Checker
            </CardTitle>
            <CardDescription>
              Paste text below to check for potential plagiarism and get rewrite suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col space-y-4">
            <div className="flex-grow flex flex-col">
                <Textarea
                    placeholder="Paste your content here (min 10 characters)..."
                    className="min-h-[300px] flex-grow resize-none text-base h-full rounded-xl shadow-inner bg-white focus-visible:ring-primary"
                    style={{minHeight: 'calc(100vh - 350px)'}}
                    maxLength={50000}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                 <div className="flex justify-between items-center pt-2">
                    <p className="text-xs text-muted-foreground italic">
                        All checks are private and secure.
                    </p>
                    <p className={`text-xs ${charCount > 45000 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                        {charCount.toLocaleString()} / 50,000 characters
                    </p>
                </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleCheck} 
                disabled={isLoading || text.length < 10} 
                size="lg" 
                className="rounded-full shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
              >
                {isLoading ? (
                  <LoaderCircle className="animate-spin mr-2" />
                ) : (
                  <Wand2 className="mr-2" />
                )}
                {isLoading ? "Analyzing..." : "Check for Plagiarism"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="h-full flex flex-col shadow-xl rounded-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Analysis Report</CardTitle>
            {result && (
                <div className="flex items-center gap-4 pt-2 animate-in fade-in slide-in-from-top-1">
                    <CardDescription>AI Originality Score:</CardDescription>
                    <Badge variant="default" className="text-lg rounded-md px-3">{result.score}%</Badge>
                </div>
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground space-y-2">
                        <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-primary"/>
                        <p className="font-semibold text-foreground">Analyzing your text...</p>
                        <p className="text-sm">Scanned against our AI database.</p>
                    </div>
                </div>
            ) : (
                <div className="p-4 border rounded-lg h-full overflow-y-auto bg-muted/20 min-h-[300px]">
                    {renderResult()}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
