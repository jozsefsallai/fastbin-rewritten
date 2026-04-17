"use client";

import { ThemeSwitcher } from "@/components/common/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { languages } from "@/lib/languages";
import { FilePlus, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export type NavigationItem = {
  url?: string;
  external?: boolean;
  icon: ReactNode;
  tooltip: string;
  onClick?: () => void | Promise<void>;
  pending?: boolean;
};

export type TheHeaderProps = {
  items: NavigationItem[];
  displayLanguages?: boolean;
  documentLanguage?: string;
  setDocumentLanguage?: (lang: string) => void;
};

export function TheHeader({
  items,
  displayLanguages,
  documentLanguage,
  setDocumentLanguage,
}: TheHeaderProps) {
  const navigationItems: NavigationItem[] = [
    {
      url: "/",
      tooltip: "New (ctrl+i)",
      icon: <FilePlus />,
    },
    {
      url: "/about",
      tooltip: "About",
      icon: <Info />,
    },

    ...items,
  ];

  const currentLanguage = documentLanguage
    ? Object.values(languages).find((l) => l.id === documentLanguage)
    : undefined;

  return (
    <header className="fixed z-50 bottom-0 left-0 right-0 flex h-16 items-center justify-center border-t border-border/60 bg-background/80 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 md:top-0 md:border-b md:border-t-0 md:shadow-sm">
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

      <div className="flex w-full items-center justify-center gap-4 md:justify-between md:px-6">
        <div className="hidden font-mono text-2xl font-semibold tracking-tight md:block">
          fastbin
          <sup className="ml-0.5 align-super text-xs font-normal tabular-nums text-muted-foreground">
            v3
          </sup>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <ThemeSwitcher />

          {displayLanguages && (
            <Select
              value={documentLanguage}
              onValueChange={setDocumentLanguage}
            >
              <SelectTrigger className="hidden w-64 md:flex">
                <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-left">
                  {currentLanguage?.name ?? "Language"}
                  {currentLanguage?.extension ? (
                    <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      .{currentLanguage.extension}
                    </span>
                  ) : null}
                </span>
              </SelectTrigger>

              <SelectContent className="max-h-80">
                {Object.keys(languages).map((id) => {
                  const language = languages[id];
                  return (
                    <SelectItem key={id} value={language.id}>
                      <span className="flex w-full items-center justify-between gap-2">
                        <span>{language.name}</span>
                        {language.extension ? (
                          <span className="font-mono text-xs text-muted-foreground">
                            .{language.extension}
                          </span>
                        ) : null}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}

          <div className="flex gap-1 rounded-full border border-border/80 bg-background/70 p-1 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/50">
            {navigationItems.map((item, idx) => (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div>
                    {item.url && item.external && (
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {item.icon}
                        </a>
                      </Button>
                    )}

                    {item.url && !item.external && (
                      <Button variant="outline" size="icon" asChild>
                        <Link href={item.url}>{item.icon}</Link>
                      </Button>
                    )}

                    {item.onClick && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={item.onClick}
                        disabled={item.pending}
                        aria-busy={item.pending}
                      >
                        {item.pending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          item.icon
                        )}
                      </Button>
                    )}
                  </div>
                </TooltipTrigger>

                <TooltipContent>{item.tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
