import { getDocumentStream } from "@/lib/server/getDocument";
import { iteratorToStream, nodeStreamToIterator } from "@/lib/stream";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const key = (await params).key;

  const raw = await getDocumentStream(key);
  if (!raw) {
    return new Response("File does not exist.", { status: 404 });
  }

  const iterator = nodeStreamToIterator(raw);
  const stream = iteratorToStream(iterator);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
