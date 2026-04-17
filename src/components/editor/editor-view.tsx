"use client";

import { type NavigationItem, TheHeader } from "@/components/common/the-header";
import upload from "@/lib/upload";
import { Code, Copy, Save, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Editor } from "@/components/editor/editor";
import { useHotkeys } from "react-hotkeys-hook";

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

  const [persistedKey, setPersistedKey] = useState<string | null>(null);
  const [persistedSecret, setPersistedSecret] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const hasCreatedSnippetRef = useRef(false);

  const [hasDraftContent, setHasDraftContent] = useState(
    () => (contents?.length ?? 0) > 0,
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const effectiveSnippetKey = snippetKey ?? persistedKey ?? "";
  const effectiveDeleteToken = deleteToken ?? persistedSecret ?? undefined;
  const effectiveReadOnly = readOnly || persistedKey !== null;

  const save = useCallback(async () => {
    if (isSavingRef.current || readOnly || hasCreatedSnippetRef.current) {
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);

    try {
      const {
        key: displayKey,
        storageKey,
        secret,
      } = await upload(documentContents.current, documentLanguageRef.current);

      hasCreatedSnippetRef.current = true;
      setPersistedKey(storageKey);
      setPersistedSecret(secret);

      window.history.replaceState(null, "", `/${storageKey}`);

      const copyUrl = `${window.location.origin}/${displayKey}`;
      toast.success("Snippet created", {
        duration: Number.POSITIVE_INFINITY,
        description: copyUrl,
        action: {
          label: "Copy URL",
          onClick: () => void navigator.clipboard.writeText(copyUrl),
        },
      });
    } catch (err) {
      console.error(err);
      toast.error(`Failed to create snippet. Error: ${err}`);
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }, [readOnly]);

  useHotkeys("ctrl+s", save, {
    enabled: !effectiveReadOnly,
    enableOnFormTags: true,
    enableOnContentEditable: true,
    preventDefault: true,
  });

  useHotkeys("ctrl+i", () => router.push("/"), {
    enableOnFormTags: true,
    enableOnContentEditable: true,
    preventDefault: true,
  });

  useHotkeys(
    "ctrl+shift+c",
    () => router.push(`/clone/${effectiveSnippetKey}`),
    {
      enabled: !!effectiveSnippetKey,
      enableOnFormTags: true,
      enableOnContentEditable: true,
      preventDefault: true,
    },
  );

  useHotkeys("ctrl+shift+r", () => router.push(`/raw/${effectiveSnippetKey}`), {
    enabled: !!effectiveSnippetKey,
    enableOnFormTags: true,
    enableOnContentEditable: true,
    preventDefault: true,
  });

  function setDocumentLanguage(language: string) {
    documentLanguageRef.current = language;
    _setDocumentLanguage(language);
  }

  function setDocumentContents(next: string) {
    documentContents.current = next;
    setHasDraftContent(next.length > 0);
  }

  const navigation: NavigationItem[] = [
    ...(!readOnly && persistedKey === null
      ? [
          {
            tooltip: "Save (ctrl+s)",
            icon: <Save />,
            onClick: save,
            pending: isSaving,
          },
        ]
      : []),

    ...(effectiveSnippetKey
      ? [
          {
            tooltip: "Clone (ctrl+shift+c)",
            icon: <Copy />,
            url: `/clone/${effectiveSnippetKey}`,
          },
          {
            tooltip: "Raw (ctrl+shift+r)",
            icon: <Code />,
            url: `/raw/${effectiveSnippetKey}`,
            external: true,
          },
        ]
      : []),

    ...(effectiveDeleteToken
      ? [
          {
            tooltip: "Delete",
            icon: <Trash />,
            url: `/delete/${effectiveDeleteToken}`,
          },
        ]
      : []),
  ];

  useEffect(() => {
    setHasDraftContent((contents?.length ?? 0) > 0);
  }, [contents]);

  useEffect(() => {
    if (effectiveReadOnly) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isSavingRef.current) {
        return;
      }
      if (!hasDraftContent) {
        return;
      }
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [effectiveReadOnly, hasDraftContent]);

  useEffect(() => {
    if (!snippetKey || !searchParams.has("secret")) {
      return;
    }

    window.history.replaceState(null, "", `/${snippetKey}`);
  }, [snippetKey, searchParams]);

  const showEmptyHint = !effectiveReadOnly && !hasDraftContent;

  return (
    <main className="relative min-h-dvh">
      <TheHeader
        items={navigation}
        displayLanguages
        documentLanguage={documentLanguage}
        setDocumentLanguage={setDocumentLanguage}
      />

      <div>
        {showEmptyHint && (
          <div
            className="editor pointer-events-none z-20 flex items-center justify-center bg-transparent p-8 text-center text-muted-foreground/80"
            aria-hidden
          >
            <p className="max-w-sm text-sm leading-relaxed md:text-base">
              Start typing…{" "}
              <kbd className="rounded border bg-muted/80 px-1.5 py-0.5 font-mono text-xs">
                Ctrl+S
              </kbd>{" "}
              to save,{" "}
              <kbd className="rounded border bg-muted/80 px-1.5 py-0.5 font-mono text-xs">
                Ctrl+I
              </kbd>{" "}
              for a new snippet.
            </p>
          </div>
        )}

        <Editor
          contents={contents}
          language={documentLanguage}
          setContents={setDocumentContents}
          readOnly={effectiveReadOnly}
        />
      </div>
    </main>
  );
}
