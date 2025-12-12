"use client";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage, FormDescription, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoaderCircle, Wand2 } from "lucide-react";
import React from "react";
import { SettingsPanel } from "./SettingsPanel";

interface ProcessFormProps {
  isLoading: boolean;
}

export function ProcessForm({ isLoading }: ProcessFormProps) {
  const { control, watch } = useFormContext();
  const textValue = watch("text");
  const charCount = textValue ? textValue.length : 0;

  return (
    <Card className="shadow-xl rounded-2xl h-full flex flex-col bg-card">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Input & Controls</CardTitle>
        <CardDescription>Enter text and adjust AI parameters for summarization.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col">
        <SettingsPanel />
        <FormField
          control={control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-grow flex flex-col pt-4">
              <FormLabel className="sr-only">Input Text</FormLabel>
              <FormControl className="flex-grow">
                <Textarea
                  placeholder="Paste your text here..."
                  className="min-h-[400px] flex-grow resize-none text-base h-full rounded-xl shadow-inner bg-white"
                  maxLength={50000}
                  {...field}
                />
              </FormControl>
              <div className="flex justify-between items-center pt-2">
                <FormMessage />
                <FormDescription className="text-xs text-muted-foreground">
                  {charCount} / 50,000 characters
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isLoading} size="lg" className="rounded-full shadow-lg hover:shadow-primary/30 transition-shadow">
            {isLoading ? (
              <LoaderCircle className="animate-spin mr-2" />
            ) : (
              <Wand2 className="mr-2" />
            )}
            Summarize Text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
