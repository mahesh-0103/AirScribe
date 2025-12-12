"use client";
import { useState } from "react";
import type { ProcessedResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, Sparkles, Tags, FileText, ClipboardCopy, Check, FileType, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import jsPDF from 'jspdf';

interface ResultsDisplayProps {
  isLoading: boolean;
  result: ProcessedResult | null;
}

const ProcessingState = () => (
    <div className="flex flex-col items-center justify-center h-full p-12 space-y-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 animate-in fade-in duration-500">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-pulse" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800">AirScribe is thinking...</h3>
        <p className="text-sm text-slate-500">Extracting essence and generating key insights.</p>
      </div>
    </div>
  );
  

export function ResultsDisplay({ isLoading, result }: ResultsDisplayProps) {
  const [showLocalDraft, setShowLocalDraft] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleDownloadPdf = () => {
    if (!result) return;
    const doc = new jsPDF();
    
    doc.setFontSize(24);
    doc.setTextColor(45, 75, 125); // primary color
    doc.text("AirScribe Report", 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // muted-foreground
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 27);

    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240); // border
    doc.line(20, 30, 190, 30);

    doc.setFontSize(12);
    doc.setTextColor(45, 55, 72);
    doc.setFont("helvetica", "bold");
    doc.text("Essence:", 20, 40);

    doc.setFont("helvetica", "italic");
    const essenceLines = doc.splitTextToSize(result.essence, 170);
    doc.text(essenceLines, 20, 47);

    doc.setFont("helvetica", "bold");
    doc.text("Keywords:", 20, 65);

    doc.setFont("helvetica", "normal");
    const keywordsString = result.keywords.join(', ');
    doc.text(keywordsString, 20, 72);

    doc.setFont("helvetica", "bold");
    doc.text("Final Summary:", 20, 85);

    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(result.geminiSummary, 170);
    doc.text(summaryLines, 20, 92);
    
    doc.save('AirScribe_Report.pdf');
  };
  
  const handleCopyToClipboard = () => {
      if (!result) return;
      const summaryToCopy = showLocalDraft ? result.bartSummary : result.geminiSummary;
      navigator.clipboard.writeText(summaryToCopy).then(() => {
          setCopied(true);
          toast({ title: "Copied to clipboard!" });
          setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
          console.error("Failed to copy:", err);
          toast({ variant: "destructive", title: "Failed to copy text." });
      });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <CardContent className="h-full">
            <ProcessingState />
        </CardContent>
      );
    }
  
    if (!result) {
      return (
          <CardContent className="h-full flex items-center justify-center">
              <div className="text-center py-20 border-dashed border-2 rounded-xl bg-muted/50 w-full">
                  <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium font-headline text-muted-foreground">Your results will appear here</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Enter text and click "Summarize Text" to begin.</p>
              </div>
          </CardContent>
      );
    }
    
    const summary = showLocalDraft ? result.bartSummary : result.geminiSummary;
  
    return (
      <div className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                  <CardTitle className="font-headline flex items-center gap-2 text-2xl"><Sparkles className="text-primary"/>Processed Output</CardTitle>
                  <CardDescription className="mt-2 flex items-start gap-2">
                    <strong className="text-primary/90 font-semibold shrink-0">Essence:</strong> 
                    <span className="italic">{result.essence}</span>
                  </CardDescription>
              </div>
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                  <Button onClick={handleCopyToClipboard} variant="outline" size="sm" className="rounded-full">
                    {copied ? <Check className="mr-2 text-green-500"/> : <ClipboardCopy className="mr-2"/>}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button onClick={handleDownloadPdf} variant="outline" size="sm" className="rounded-full"><FileType className="mr-2 h-4 w-4" /> PDF</Button>
              </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 flex-grow flex flex-col min-h-0">
           <div className="flex items-center space-x-2">
              <Switch id="hybrid-view" checked={showLocalDraft} onCheckedChange={setShowLocalDraft} />
              <Label htmlFor="hybrid-view">View Intermediate Analysis</Label>
           </div>
          <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Tags size={16}/> Keywords</h3>
              <div className="flex flex-wrap gap-2">
                  {result.keywords.length > 0 ? (
                      result.keywords.map(kw => <Badge key={kw} variant="secondary" className="rounded-full cursor-pointer hover:bg-primary/10 transition-colors">{kw}</Badge>)
                  ) : (
                      <p className="text-sm text-muted-foreground">No keywords were extracted.</p>
                  )}
              </div>
          </div>
          <div className="flex-grow flex flex-col min-h-0">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                  <FileText size={16}/> {showLocalDraft ? 'Intermediate Analysis' : 'Final Summary'}
              </h3>
              <ScrollArea className="flex-grow rounded-xl bg-muted/50 shadow-inner">
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 leading-relaxed whitespace-pre-wrap">
                    {summary}
                </div>
              </ScrollArea>
          </div>
        </CardContent>
      </div>
    );
  };


  return (
    <Card className="shadow-xl rounded-2xl h-full bg-card/80 backdrop-blur-sm">
      {renderContent()}
    </Card>
  );
}
