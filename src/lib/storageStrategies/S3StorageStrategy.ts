import type { Readable } from "node:stream";
import { S3 } from "@/lib/clients/s3";
import type {
  IStorageStrategy,
  ICreateFileOptions,
  S3Credentials,
} from "@/lib/storageStrategies/types";
import { env, type Env } from "@/lib/env";

export class S3StorageStrategy<T extends S3> implements IStorageStrategy {
  private s3: T;

  constructor(client?: T) {
    if (!client) {
      const credentials = S3StorageStrategy.getS3Credentials();
      this.s3 = new S3(credentials) as T;
    } else {
      this.s3 = client;
    }
  }

  async exists(key: string): Promise<boolean> {
    this.ensureClientExists();

    return this.s3.exists(key);
  }

  async delete(key: string): Promise<boolean> {
    this.ensureClientExists();
    return this.s3.delete(key);
  }

  async create(opts: ICreateFileOptions) {
    this.ensureClientExists();
    const finalOpts = this.makeFinalOptions(opts);
    await this.s3.upload(finalOpts);
  }

  async getStream(key: string): Promise<Readable> {
    this.ensureClientExists();
    return this.s3.getStream(key);
  }

  async get(key: string): Promise<Buffer> {
    return this.s3.read(key);
  }

  private static getS3Credentials(): S3Credentials {
    if (env.STORAGE_STRATEGY !== "s3") {
      // should never happen normally
      throw new Error("Invalid storage strategy");
    }

    const requiredEnvVars: Array<keyof Env> = [
      "S3_ACCESS_KEY_ID",
      "S3_SECRET_ACCESS_KEY",
      "S3_REGION",
      "S3_BUCKET_NAME",
      "S3_ENDPOINT",
    ];

    for (const envVar of requiredEnvVars) {
      if (!env[envVar]) {
        throw new Error(
          `Missing required environment variable for S3 storage strategy: ${envVar}`,
        );
      }
    }

    return {
      accessKeyId: env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY as string,
      region: env.S3_REGION as string,
      bucketName: env.S3_BUCKET_NAME as string,
      endpoint: env.S3_ENDPOINT as string,
      publicBaseUrl: env.S3_PUBLIC_BASE_URL,
    };
  }

  private ensureClientExists() {
    if (!this.s3) {
      throw new Error("S3 client not initialized");
    }
  }

  private makeFinalOptions(opts: ICreateFileOptions): ICreateFileOptions {
    const defaultOptions = {
      mimeType: "application/octet-stream",
      isPublic: false,
    };

    return {
      ...defaultOptions,
      ...opts,
    };
  }

  buildPublicUrl(key: string): string {
    if (!this.s3) {
      throw new Error("S3 client not initialized");
    }

    return `${this.s3.baseUrl}/${key}`;
  }
}
