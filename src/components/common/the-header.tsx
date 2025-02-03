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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { languages } from "@/lib/languages";
import { FilePlus, Info } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export type NavigationItem = {
  url?: string;
  external?: boolean;
  icon: ReactNode;
  tooltip: string;
  onClick?: () => void | Promise<void>;
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

  return (
    <header className="fixed z-50 bottom-0 md:top-0 left-0 right-0 flex items-center justify-center md:justify-between py-4 px-8 h-16 border-t">
      <div className="hidden md:block font-mono text-2xl">
        fastbin
        <sup>
          <small>v3</small>
        </sup>
      </div>

      <div className="flex gap-6 items-center">
        <ThemeSwitcher />

        {displayLanguages && (
          <Select value={documentLanguage} onValueChange={setDocumentLanguage}>
            <SelectTrigger className="w-64 hidden md:flex">
              {(documentLanguage
                ? Object.values(languages).find(
                    (l) => l.id === documentLanguage,
                  )?.name
                : null) ?? "Language"}
            </SelectTrigger>

            <SelectContent>
              {Object.keys(languages).map((id) => {
                const language = languages[id];
                return (
                  <SelectItem key={id} value={language.id}>
                    {language.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}

        <div className="flex gap-1">
          <TooltipProvider>
            {navigationItems.map((item, idx) => (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div>
                    {item.url && item.external && (
                      <Button variant="outline" asChild>
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
                      <Button variant="outline" asChild>
                        <Link href={item.url}>{item.icon}</Link>
                      </Button>
                    )}

                    {item.onClick && (
                      <Button variant="outline" onClick={item.onClick}>
                        {item.icon}
                      </Button>
                    )}
                  </div>
                </TooltipTrigger>

                <TooltipContent>{item.tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
