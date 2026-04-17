"use client";

import { LoadingContainer } from "@/components/common/loading-container";
import type { EditorProps } from "@/components/editor/editor-types";
import { MobileEditor } from "@/components/editor/mobile-editor";
import checkMobile from "ismobilejs";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MonacoEditorPanel = dynamic(
  () =>
    import("@/components/editor/monaco-editor-panel").then(
      (m) => m.MonacoEditorPanel,
    ),
  {
    ssr: false,
    loading: () => <LoadingContainer />,
  },
);

export type { EditorProps } from "@/components/editor/editor-types";

export function Editor(props: EditorProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const _isMobile = checkMobile(window.navigator).any;
    setIsMobile(_isMobile);
  }, []);

  if (isMobile) {
    return <MobileEditor {...props} />;
  }

  return <MonacoEditorPanel {...props} />;
}
