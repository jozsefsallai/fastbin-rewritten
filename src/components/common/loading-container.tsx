import { LoaderCircle } from "lucide-react";

export function LoadingContainer() {
  return (
    <div className="editor flex flex-col items-center justify-center gap-4">
      <LoaderCircle className="w-16 h-16 animate-spin" />
      <div className="text-muted-foreground text-xl animate-pulse">
        Loading, please wait
      </div>
    </div>
  );
}
