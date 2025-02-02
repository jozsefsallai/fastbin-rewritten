import type { Readable } from "node:stream";

export async function* nodeStreamToIterator(stream: Readable) {
  for await (const chunk of stream) {
    yield chunk;
  }
}

export function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(new Uint8Array(value));
      }
    },
  });
}
