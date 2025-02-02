import {
  type PutObjectCommandOutput,
  S3 as S3Client,
} from "@aws-sdk/client-s3";
import type { Readable } from "node:stream";
import type {
  ICreateFileOptions,
  S3Credentials,
} from "@/lib/storageStrategies/types";

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
    });

    return data;
  }

  async getStream(key: string) {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    const data = await this.s3.getObject(params);
    return data.Body as Readable;
  }

  async read(key: string): Promise<Buffer> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    const data = await this.s3.getObject(params);
    const bytes = await data.Body?.transformToByteArray();

    if (!bytes) {
      throw new Error("Failed to read file from S3");
    }

    return Buffer.from(bytes);
  }
}
