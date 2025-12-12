"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BotMessageSquare, ShieldCheck, History, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Summarizer", icon: BotMessageSquare },
    { href: "/plagiarism", label: "Plagiarism Checker", icon: ShieldCheck },
    { href: "/history", label: "History", icon: History },
    { href: "/help", label: "Help", icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="px-4 flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <BotMessageSquare className="h-7 w-7 text-primary" />
          <span className="font-bold font-headline text-2xl tracking-tighter">
            AirScribe
          </span>
        </Link>
        <nav className="flex items-center space-x-2 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary flex items-center gap-2 px-3 py-2 rounded-md",
                pathname === link.href
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-muted-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
