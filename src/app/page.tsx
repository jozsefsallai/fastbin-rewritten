import { EditorView } from "@/components/editor/editor-view";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <EditorView languageId="plain" />
    </Suspense>
  );
}
