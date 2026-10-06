import { Readable } from "node:stream";
import type {
  ICreateFileOptions,
  VercelBlobCredentials,
} from "@/lib/storageStrategies/types";
import { BlobNotFoundError, del, get, head, put } from "@vercel/blob";

export class VercelBlob {
  private token: string;
  private access: "public" | "private";

  constructor(credentials: VercelBlobCredentials) {
    this.token = credentials.token;
    this.access = credentials.access;
  }

  async exists(key: string): Promise<boolean> {
    try {
      await head(key, { token: this.token });
      return true;
    } catch (err: unknown) {
      if (VercelBlob.isNotFound(err)) {
        return false;
      }
      throw err;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await del(key, { token: this.token });
      return true;
    } catch (err: unknown) {
      if (VercelBlob.isNotFound(err)) {
        return true; // This key doesn't exist, we wanted to delete it anyway.
      }
      throw err;
    }
  }

  async upload(opts: ICreateFileOptions): Promise<void> {
    await put(opts.key, opts.data, {
      token: this.token,
      access: this.access,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: opts.mimeType,
    });
  }

  async read(key: string): Promise<Buffer | null> {
    const result = await this.fetch(key);

    if (!result) {
      return null;
    }

    const chunks: Buffer[] = [];

    for await (const chunk of result) {
      chunks.push(Buffer.from(chunk as Uint8Array));
    }

    return Buffer.concat(chunks);
  }

  async getStream(key: string): Promise<Readable | null> {
    return this.fetch(key);
  }

  private async fetch(key: string): Promise<Readable | null> {
    const result = await get(key, {
      token: this.token,
      access: this.access,
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return null;
    }

    return Readable.fromWeb(result.stream as any);
  }

  private static isNotFound(err: unknown): boolean {
    if (err instanceof BlobNotFoundError) {
      return true;
    }

    if (!err || typeof err !== "object") {
      return false;
    }

    const e = err as { name?: string; status?: number };
    return e.name === "BlobNotFoundError" || e.status === 404;
  }
}
