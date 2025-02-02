import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// fastbin is open-source so it's ok if the env keys are visible in the client bundle
export const env = createEnv({
  emptyStringAsUndefined: true,

  server: {
    STORAGE_STRATEGY: z.enum(["file", "s3", "firebase", "r2"]),

    LIMITS_MAX_BODY_LENGTH: z
      .string()
      .transform((s) => Number.parseInt(s, 10))
      .pipe(z.number().positive()),
    LIMITS_MAX_PAYLOAD_SIZE: z.string(),

    FILE_STORAGE_LOCATION: z.string().optional(),

    S3_ENDPOINT: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    S3_BUCKET_NAME: z.string().optional(),
    S3_PUBLIC_BASE_URL: z.string().optional(),

    FIREBASE_SERVICE_ACCOUNT: z.string().optional(),
    FIREBASE_BUCKET: z.string().optional(),

    R2_ACCOUNT_ID: z.string().optional(),
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    R2_BUCKET_NAME: z.string().optional(),
    R2_PUBLIC_BASE_URL: z.string().optional(),

    SERVER_SECRET: z.string().length(32),
  },

  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url(),
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
});

export type Env = typeof env;
