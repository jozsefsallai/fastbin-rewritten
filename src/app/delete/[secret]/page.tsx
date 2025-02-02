import { LoadingContainer } from "@/components/common/loading-container";
import { TheHeader } from "@/components/common/the-header";
import { DeleteSnippetAlert } from "@/components/editor/delete-snippet-alert";
import { decrypt } from "@/lib/secrets";
import { notFound } from "next/navigation";

export default async function SnippetPage({
  params,
}: {
  params: Promise<{ secret: string }>;
}) {
  const { secret } = await params;
  let key: string;

  try {
    key = decrypt("id", secret);
  } catch (err) {
    console.error(err);
    return notFound();
  }

  return (
    <main>
      <TheHeader items={[]} />
      <LoadingContainer />
      <DeleteSnippetAlert snippetKey={key} token={secret} />
    </main>
  );
}
