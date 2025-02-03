"use client";

import { Textarea } from "@/components/ui/textarea";
import type { ChangeEvent, MouseEvent } from "react";

export type MobileEditorProps = {
  contents?: string;
  readOnly?: boolean;
  setContents?(contents: string): void | Promise<void>;
};

export function MobileEditor({
  contents,
  readOnly,
  setContents,
}: MobileEditorProps) {
  function handleEditorChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContents?.(e.currentTarget.value);
  }

  function handleEditorClick(e: MouseEvent<HTMLTextAreaElement>) {
    e.currentTarget.select();
  }

  return (
    <Textarea
      className="editor rounded-none outline-none resize-none focus-visible:ring-0 text-base font-mono"
      onChange={handleEditorChange}
      readOnly={readOnly}
      spellCheck={false}
      onClick={handleEditorClick}
    >
      {contents}
    </Textarea>
  );
}
