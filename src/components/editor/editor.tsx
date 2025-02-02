"use client";

import { Editor as MonacoEditor } from "@monaco-editor/react";
import checkMobile from "ismobilejs";
import { MobileEditor } from "@/components/editor/mobile-editor";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { initializeMonaco } from "@/lib/monaco";

export type EditorProps = {
  contents?: string;
  readOnly?: boolean;
  language: string;
  setContents?(contents: string): void | Promise<void>;
};

export function Editor({
  contents,
  readOnly,
  language,
  setContents,
}: EditorProps) {
  const [isMobile, setIsMobile] = useState(false);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const _isMobile = checkMobile(window.navigator).any;
    setIsMobile(_isMobile);
  }, []);

  function handleEditorChange(value: string | undefined) {
    setContents?.(value ?? "");
  }

  if (isMobile) {
    return (
      <MobileEditor
        contents={contents}
        readOnly={readOnly}
        setContents={setContents}
      />
    );
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
