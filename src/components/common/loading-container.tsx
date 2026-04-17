import { Skeleton } from "@/components/ui/skeleton";

export function LoadingContainer() {
  return (
    <div className="editor flex flex-col gap-4 bg-background/40 p-4 backdrop-blur-sm md:p-8">
      <Skeleton className="min-h-[min(60vh,28rem)] w-full flex-1 rounded-lg border border-border/50" />
      <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <span
          className="size-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-duration:1.1s]"
          aria-hidden
        />
        <span
          className="size-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:150ms] [animation-duration:1.1s]"
          aria-hidden
        />
        <span
          className="size-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:300ms] [animation-duration:1.1s]"
          aria-hidden
        />
        <span className="ml-2">Preparing editor…</span>
      </div>
    </div>
  );
}
