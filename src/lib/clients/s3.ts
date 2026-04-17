import type { Readable } from "node:stream";
import type {
  ICreateFileOptions,
  S3Credentials,
} from "@/lib/storageStrategies/types";
import {
  type PutObjectCommandOutput,
  S3 as S3Client,
} from "@aws-sdk/client-s3";

export class S3 {
  private s3: S3Client;
  private bucket: string;
  baseUrl: string;

  constructor(credentials: S3Credentials) {
    this.s3 = new S3Client({
      endpoint: credentials.endpoint,
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });

    this.bucket = credentials.bucketName;
    this.baseUrl =
      credentials.publicBaseUrl ??
      `https://${credentials.bucketName}.${credentials.endpoint}`;
  }

  async exists(key: string): Promise<boolean> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      await this.s3.headObject(params);
      return true;
    } catch (err: any) {
      if (err.name === "NotFound") {
        return false;
      }

      throw err;
    }
  }

  async delete(key: string): Promise<boolean> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      await this.s3.headObject(params);
      return true;
    } catch (err: any) {
      if (err.code === "NotFound") {
        return true; // This key doesn't exist, we wanted to delete it anyway.
      }

      throw err;
    }
  }

  async upload(opts: ICreateFileOptions): Promise<PutObjectCommandOutput> {
    const data = await this.s3.putObject({
      ACL: opts.isPublic ? "public-read" : "private",
      Body: opts.data,
      Bucket: this.bucket,
      Key: opts.key,
      ContentType: opts.mimeType,
      Metadata: opts.metadata,
    });

    return data;
  }

  async getStream(key: string): Promise<Readable | null> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      const data = await this.s3.getObject(params);
      return data.Body as Readable;
    } catch (err: unknown) {
      if (this.isNotFound(err)) {
        return null;
      }
      throw err;
    }
  }

  async read(key: string): Promise<Buffer | null> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      const data = await this.s3.getObject(params);
      const bytes = await data.Body?.transformToByteArray();

      if (!bytes) {
        return null;
      }

      return Buffer.from(bytes);
    } catch (err: unknown) {
      if (this.isNotFound(err)) {
        return null;
      }
      throw err;
    }
  }

  private isNotFound(err: unknown): boolean {
    if (!err || typeof err !== "object") {
      return false;
    }
    const e = err as {
      name?: string;
      Code?: string;
      $metadata?: { httpStatusCode?: number };
    };
    return (
      e.name === "NotFound" ||
      e.name === "NoSuchKey" ||
      e.Code === "NoSuchKey" ||
      e.$metadata?.httpStatusCode === 404
    );
  }
}
