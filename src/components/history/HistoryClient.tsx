"use client";

import { useHistory } from "@/hooks/use-history";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2, History as HistoryIcon, Tags } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function HistoryClient() {
  const { history, clearHistory, isLoaded } = useHistory();

  if (!isLoaded) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline flex items-center gap-3">
          <HistoryIcon /> Processing History
        </h1>
        {history.length > 0 && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"><Trash2 className="mr-2"/> Clear All</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your processed history from this device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearHistory}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="text-center py-20 border-dashed">
          <CardContent>
            <h3 className="text-lg font-semibold text-muted-foreground">Your history is empty</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Processed text summaries will appear here for future reference.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {history.map(item => (
            <AccordionItem value={item.id} key={item.id} className="border-0">
              <Card className="shadow-md transition-shadow hover:shadow-xl">
                <AccordionTrigger className="p-6 hover:no-underline rounded-t-lg">
                  <div className="flex-1 text-left space-y-1">
                    <p className="font-semibold text-primary">{item.result.essence}...</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Tags size={16}/>Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.result.keywords.map(kw => <Badge key={kw} variant="secondary">{kw}</Badge>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><FileText size={16}/>Final Summary</h4>
                      <p className="text-sm p-3 border rounded-md bg-muted/20 whitespace-pre-wrap">
                        {item.result.geminiSummary}
                      </p>
                    </div>
                     <div>
                      <h4 className="font-semibold text-sm mb-2">Original Text</h4>
                      <p className="text-sm text-muted-foreground max-h-24 overflow-y-auto p-3 border rounded-md bg-muted/20 whitespace-pre-wrap">
                        {item.request.text}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
