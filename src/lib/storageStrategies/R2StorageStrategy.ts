import { R2 } from "@/lib/clients/r2";
import type {
  IStorageStrategy,
  R2Credentials,
} from "@/lib/storageStrategies/types";
import { S3StorageStrategy } from "@/lib/storageStrategies/S3StorageStrategy";
import { type Env, env } from "@/lib/env";

export class R2StorageStrategy
  extends S3StorageStrategy<R2>
  implements IStorageStrategy
{
  constructor() {
    super(new R2(R2StorageStrategy.getR2Credentials()));
  }

  private static getR2Credentials(): R2Credentials {
    if (env.STORAGE_STRATEGY !== "r2") {
      // should never happen normally
      throw new Error("Invalid storage strategy");
    }

    const requiredEnvVars: Array<keyof Env> = [
      "R2_ACCOUNT_ID",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET_NAME",
    ];

    for (const envVar of requiredEnvVars) {
      if (!env[envVar]) {
        throw new Error(
          `Missing required environment variable for R2 storage strategy: ${envVar}`,
        );
      }
    }

    return {
      accountId: env.R2_ACCOUNT_ID as string,
      accessKeyId: env.R2_ACCESS_KEY_ID as string,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY as string,
      bucketName: env.R2_BUCKET_NAME as string,
      publicBaseUrl: env.R2_PUBLIC_BASE_URL,
    };
  }
}
