import type { Readable } from "node:stream";
import { VercelBlob } from "@/lib/clients/vercelBlob";
import { type Env, env } from "@/lib/env";
import type {
  ICreateFileOptions,
  IStorageStrategy,
  VercelBlobCredentials,
} from "@/lib/storageStrategies/types";

export class VercelBlobStorageStrategy implements IStorageStrategy {
  private blob: VercelBlob;

  constructor(client?: VercelBlob) {
    this.blob =
      client ?? new VercelBlob(VercelBlobStorageStrategy.getCredentials());
  }

  async exists(key: string): Promise<boolean> {
    return this.blob.exists(key);
  }

  async delete(key: string): Promise<boolean> {
    return this.blob.delete(key);
  }

  async create(opts: ICreateFileOptions): Promise<void> {
    await this.blob.upload({
      mimeType: "text/plain",
      ...opts,
    });
  }

  async get(key: string): Promise<Buffer | null> {
    return this.blob.read(key);
  }

  async getStream(key: string): Promise<Readable | null> {
    return this.blob.getStream(key);
  }

  private static getCredentials(): VercelBlobCredentials {
    if (env.STORAGE_STRATEGY !== "vercel-blob") {
      // should never happen normally
      throw new Error("Invalid storage strategy");
    }

    const requiredEnvVars: Array<keyof Env> = ["BLOB_READ_WRITE_TOKEN"];

    for (const envVar of requiredEnvVars) {
      if (!env[envVar]) {
        throw new Error(
          `Missing required environment variable for Vercel Blob storage strategy: ${envVar}`,
        );
      }
    }

    return {
      token: env.BLOB_READ_WRITE_TOKEN as string,
      access: env.BLOB_ACCESS ?? "public",
    };
  }
}
