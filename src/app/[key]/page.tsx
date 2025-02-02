import { EditorView } from "@/components/editor/editor-view";
import { languages } from "@/lib/languages";
import { getDocument } from "@/lib/server/getDocument";
import { notFound } from "next/navigation";

export default async function SnippetPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ secret?: string }>;
}) {
  let { key } = await params;
  const { secret } = await searchParams;

  let languageId = "plain";

  const components = key.split(".");
  if (components.length > 1) {
    const extension = components.pop();
    key = components.join(".");

    const targetLanguage = Object.values(languages).find(
      (lang) => lang.extension === extension,
    );

    if (targetLanguage) {
      languageId = targetLanguage.id;
    }
  }

  const document = await getDocument(key);
  if (!document) {
    return notFound();
  }

  return (
    <EditorView
      contents={document.toString("utf-8")}
      languageId={languageId}
      readOnly={true}
      snippetKey={key}
      deleteToken={secret}
    />
  );
}
