"use client";

import { TheHeader, type NavigationItem } from "@/components/common/the-header";
import upload from "@/lib/upload";
import { Code, Copy, Save, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useHotkeys } from "react-hotkeys-hook";
import { Editor } from "@/components/editor/editor";
import { LoadingContainer } from "@/components/common/loading-container";

export type EditorViewProps = {
  contents?: string;
  languageId: string;
  readOnly?: boolean;
  snippetKey?: string;
  deleteToken?: string;
};

export function EditorView({
  contents,
  languageId,
  readOnly,
  snippetKey,
  deleteToken,
}: EditorViewProps) {
  const [documentLanguage, _setDocumentLanguage] = useState(languageId);
  const documentLanguageRef = useRef(languageId);

  const documentContents = useRef(contents ?? "");

  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useHotkeys("ctrl+s", save, {
    enabled: !readOnly,
    enableOnFormTags: true,
    enableOnContentEditable: true,
    preventDefault: true,
  });

  useHotkeys("ctrl+i", () => router.push("/"), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
    preventDefault: true,
  });

  useHotkeys("ctrl+shift+c", () => router.push(`/clone/${snippetKey}`), {
    enabled: !!snippetKey,
    enableOnFormTags: true,
    enableOnContentEditable: true,
    preventDefault: true,
  });

  useHotkeys("ctrl+shift+r", () => router.push(`/raw/${snippetKey}`), {
    enabled: !!snippetKey,
    enableOnFormTags: true,
    enableOnContentEditable: true,
    preventDefault: true,
  });

  function setDocumentLanguage(language: string) {
    documentLanguageRef.current = language;
    _setDocumentLanguage(language);
  }

  function setDocumentContents(contents: string) {
    documentContents.current = contents;
  }

  async function save() {
    if (isUploading) {
      return;
    }

    setIsUploading(true);

    try {
      const { key, secret } = await upload(
        documentContents.current,
        documentLanguageRef.current,
      );

      toast.success("Snippet created successfully! Redirecting...");
      router.push(`/${key}?secret=${secret}`);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      toast.error(`Failed to create snippet. Error: ${err}`);
    }
  }

  const navigation: NavigationItem[] = [
    ...(!readOnly
      ? [
          {
            tooltip: "Save (ctrl+s)",
            icon: <Save />,
            onClick: save,
          },
        ]
      : []),

    ...(snippetKey
      ? [
          {
            tooltip: "Clone (ctrl+shift+c)",
            icon: <Copy />,
            url: `/clone/${snippetKey}`,
          },
          {
            tooltip: "Raw (ctrl+shift+r)",
            icon: <Code />,
            url: `/raw/${snippetKey}`,
            external: true,
          },
        ]
      : []),

    ...(deleteToken
      ? [
          {
            tooltip: "Delete",
            icon: <Trash />,
            url: `/delete/${deleteToken}`,
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (readOnly) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [readOnly]);

  useEffect(() => {
    if (!snippetKey || !searchParams.has("secret")) {
      return;
    }

    window.history.replaceState(null, "", `/${snippetKey}`);
  }, [snippetKey, searchParams]);

  return (
    <main>
      <TheHeader
        items={navigation}
        displayLanguages
        documentLanguage={documentLanguage}
        setDocumentLanguage={setDocumentLanguage}
      />

      {!isUploading && (
        <Editor
          contents={contents}
          language={documentLanguage}
          setContents={setDocumentContents}
          readOnly={readOnly}
        />
      )}

      {isUploading && <LoadingContainer />}
    </main>
  );
}
