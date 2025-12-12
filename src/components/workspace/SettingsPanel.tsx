"use client";
import { useFormContext, Controller } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Lightbulb, Ruler, TextQuote } from "lucide-react";
import { cn } from "@/lib/utils";

const RadioCardLabel = ({ htmlFor, "data-state": dataState, children, className }: { htmlFor: string; "data-state": "checked" | "unchecked"; children: React.ReactNode, className?: string }) => (
  <FormLabel
    htmlFor={htmlFor}
    data-state={dataState}
    className={cn("flex items-center justify-center rounded-full border-2 border-muted bg-popover px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 transition-colors", className)}
  >
    {children}
  </FormLabel>
);

export function SettingsPanel() {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <Controller
          control={control}
          name="domain"
          render={({ field }) => (
            <FormItem className="space-y-3 md:col-span-2">
              <FormLabel className="flex items-center gap-2 font-semibold text-sm"><Briefcase size={16}/> Domain</FormLabel>
              <FormControl>
                <Tabs
                  value={field.value}
                  onValueChange={field.onChange}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="GENERAL_NEWS">General</TabsTrigger>
                    <TabsTrigger value="RESEARCH_PAPER">Research</TabsTrigger>
                  </TabsList>
                </Tabs>
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="tone"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="flex items-center gap-2 font-semibold text-sm"><Lightbulb size={16} /> Tone</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-2"
                >
                  {["Professional", "Creative", "Concise"].map((t) => (
                    <FormItem key={t}>
                      <FormControl>
                        <RadioGroupItem value={t} id={`tone-${t}`} className="sr-only" />
                      </FormControl>
                      <RadioCardLabel htmlFor={`tone-${t}`} data-state={field.value === t ? 'checked' : 'unchecked'}>
                        {t}
                      </RadioCardLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="length"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="flex items-center gap-2 font-semibold text-sm"><Ruler size={16}/> Length</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-2"
                >
                  {["Short", "Medium", "Long"].map((l) => (
                    <FormItem key={l}>
                      <FormControl>
                        <RadioGroupItem value={l} id={`length-${l}`} className="sr-only" />
                      </FormControl>
                      <RadioCardLabel htmlFor={`length-${l}`} data-state={field.value === l ? 'checked' : 'unchecked'}>
                        {l}
                      </RadioCardLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="quality"
          render={({ field }) => (
            <FormItem className="space-y-3 md:col-span-2">
              <FormLabel className="flex items-center gap-2 font-semibold text-sm"><TextQuote size={16} /> Quality</FormLabel>
               <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-2"
                >
                  {["Standard", "High Quality"].map((q) => (
                    <FormItem key={q}>
                      <FormControl>
                        <RadioGroupItem value={q} id={`quality-${q}`} className="sr-only" />
                      </FormControl>
                      <RadioCardLabel htmlFor={`quality-${q}`} data-state={field.value === q ? 'checked' : 'unchecked'}>
                        {q}
                      </RadioCardLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
    </div>
  );
}
