"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { processText } from "@/app/actions";
import type { ProcessRequestData, ProcessedResult, HistoryItem, Domain } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useHistory } from "@/hooks/use-history";

import { ProcessForm } from "./ProcessForm";
import { ResultsDisplay } from "./ResultsDisplay";

const formSchema = z.object({
  text: z.string().min(10, "Please enter at least 10 characters to process.").max(50000, "Text cannot exceed 50,000 characters."),
  domain: z.enum(["GENERAL_NEWS", "RESEARCH_PAPER"]),
  tone: z.enum(["Professional", "Creative", "Concise"]),
  quality: z.enum(["Standard", "High Quality"]),
  length: z.enum(["Short", "Medium", "Long"]),
});

export function Workspace() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const { toast } = useToast();
  const { addToHistory } = useHistory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "LONDON -- How to respond to a global pandemic? That’s a question that has bedeviled governments since the start of the year. Some have locked down their populations, others have paid people to stay home, still others have launched an ambitious track-and-trace programs. Sweden, famously, has done none of the above. It has kept elementary schools and businesses open and relied on citizens’ sense of social responsibility to curb the spread of the virus. This has made it a pariah in its neighborhood -- and a potential model for the rest of the world. As the northern hemisphere braces for a second wave of infections, governments are desperate for a strategy that will be effective and that their populations will be willing to follow for the long haul. Many are looking to the so-called Swedish model as a potential path forward.",
      domain: "GENERAL_NEWS",
      tone: "Professional",
      quality: "Standard",
      length: "Medium",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const requestData: ProcessRequestData = values;
    const response = await processText(requestData);

    setIsLoading(false);

    if ("error" in response) {
      toast({
        variant: "destructive",
        title: "Processing Failed",
        description: response.error,
      });
    } else {
      setResult(response);
      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        request: requestData,
        result: response,
      };
      addToHistory(historyItem);
      toast({
        title: "Processing Complete",
        description: "Your text has been successfully processed.",
      });
    }
  }
  
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-start">
          <div className="h-full">
            <ProcessForm isLoading={isLoading} />
          </div>
          <div className="h-full">
            <ResultsDisplay isLoading={isLoading} result={result} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
