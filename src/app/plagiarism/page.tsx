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
import { LoaderCircle, ShieldCheck, Wand2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DUMMY_RESULT = {
    originalText: "Sweden, famously, has done none of the above. It has kept elementary schools and businesses open and relied on citizens’ sense of social responsibility to curb the spread of the virus. This has made it a pariah in its neighborhood -- and a potential model for the rest of the world. Many are looking to the so-called Swedish model as a potential path forward.",
    plagiarizedSegments: [
      {
        text: "relied on citizens’ sense of social responsibility",
        suggestion: "depended on the public's feeling of civic duty"
      },
      {
        text: "pariah in its neighborhood",
        suggestion: "an outcast among its neighbors"
      },
      {
        text: "potential model for the rest of the world",
        suggestion: "possible example for other nations"
      }
    ],
    score: 98,
}


export default function PlagiarismPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState(DUMMY_RESULT.originalText);
  const [result, setResult] = useState<typeof DUMMY_RESULT | null>(null);

  const charCount = text.length;

  const handleCheck = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        setResult(DUMMY_RESULT);
        setIsLoading(false);
    }, 1500);
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
        return <p className="text-muted-foreground">The processed text with highlights will appear here.</p>;
    }
    
    let lastIndex = 0;
    const parts = [];

    const sortedSegments = [...result.plagiarizedSegments].sort((a,b) => result.originalText.indexOf(a.text) - result.originalText.indexOf(b.text));

    sortedSegments.forEach((segment, i) => {
      const index = result.originalText.indexOf(segment.text, lastIndex);
      if (index > lastIndex) {
        parts.push(result.originalText.substring(lastIndex, index));
      }
      parts.push(
        <TooltipProvider key={i}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="bg-yellow-200/80 underline decoration-red-500 decoration-wavy underline-offset-2 cursor-pointer rounded-sm px-1">
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
                    placeholder="Paste your text here to check for plagiarism..."
                    className="min-h-[300px] flex-grow resize-none text-base h-full rounded-xl shadow-inner bg-white"
                    style={{minHeight: 'calc(100vh - 350px)'}}
                    maxLength={50000}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                 <div className="flex justify-between items-center pt-2">
                    <div></div>
                    <p className="text-xs text-muted-foreground">
                        {charCount} / 50,000 characters
                    </p>
                </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCheck} disabled={isLoading || text.length < 10} size="lg" className="rounded-full shadow-lg hover:shadow-primary/30 transition-shadow">
                {isLoading ? (
                  <LoaderCircle className="animate-spin mr-2" />
                ) : (
                  <Wand2 className="mr-2" />
                )}
                Check for Plagiarism
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="h-full flex flex-col shadow-xl rounded-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Analysis Report</CardTitle>
            {result && (
                <div className="flex items-center gap-4 pt-2">
                    <CardDescription>AI Originality Score:</CardDescription>
                    <Badge variant="default" className="text-lg rounded-md">{result.score}%</Badge>
                </div>
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground space-y-2">
                        <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-primary"/>
                        <p className="font-semibold">Analyzing your text...</p>
                        <p className="text-sm">Please wait a moment.</p>
                    </div>
                </div>
            ) : (
                <div className="p-4 border rounded-lg h-full overflow-y-auto bg-muted/20">
                    {renderResult()}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
