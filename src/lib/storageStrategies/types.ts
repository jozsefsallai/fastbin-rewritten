import type { Env } from "@/lib/env";
import type { Readable } from "node:stream";

export type S3Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
  endpoint: string;
  publicBaseUrl?: string;
};

export type R2Credentials = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicBaseUrl?: string;
};

export type FirebaseCredentials = {
  serviceAccount: string;
  bucketName: string;
};

export type StorageStrategyCredentials = S3Credentials | R2Credentials;

export type SupportedStorageStrategy = Env["STORAGE_STRATEGY"];

export type ICreateFileOptions = {
  key: string;
  data: Buffer | string;
  mimeType?: string;
  isPublic?: boolean;
  metadata?: Record<string, any>;
};

export interface IStorageStrategy {
  create(params: ICreateFileOptions): Promise<void>;
  get(key: string): Promise<Buffer>;
  getStream(key: string): Promise<Readable>;
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<boolean>;
}
