import { getDocument } from "@/lib/server/getDocument";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const key = (await params).key;
  const contents = await getDocument(key);

  if (!contents) {
    return Response.json({
      ok: false,
      error: "File does not exist.",
    });
  }

  return Response.json({
    ok: true,
    contents: contents.toString("utf-8"),
  });
}
