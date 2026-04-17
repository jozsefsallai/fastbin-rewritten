"use client";

import type { EditorProps } from "@/components/editor/editor-types";
import { initializeMonaco } from "@/lib/monaco";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { useTheme } from "next-themes";

export function MonacoEditorPanel({
  contents,
  readOnly,
  language,
  setContents,
}: EditorProps) {
  const { resolvedTheme } = useTheme();

  function handleEditorChange(value: string | undefined) {
    setContents?.(value ?? "");
  }

  return (
    <MonacoEditor
      language={language}
      value={contents}
      onChange={handleEditorChange}
      theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
      className="editor"
      options={{
        fontFamily: "var(--font-geist-mono)",
        fontLigatures: true,
        lineHeight: 22,
        readOnly,
      }}
      onMount={(_editor, monaco) => {
        initializeMonaco(monaco);
      }}
    />
  );
}
