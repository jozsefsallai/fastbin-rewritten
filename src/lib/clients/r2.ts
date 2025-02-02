import type { R2Credentials } from "@/lib/storageStrategies/types";
import { S3 } from "./s3";

export class R2 extends S3 {
  constructor(credentials: R2Credentials) {
    super({
      region: "auto",
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      bucketName: credentials.bucketName,
      endpoint: R2.buildR2Endpoint(credentials.accountId),
      publicBaseUrl: credentials.publicBaseUrl,
    });
  }

  private static buildR2Endpoint(accountId: string) {
    return `https://${accountId}.r2.cloudflarestorage.com`;
  }
}
