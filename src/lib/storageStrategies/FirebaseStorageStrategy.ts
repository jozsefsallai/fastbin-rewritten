import { Firebase } from "@/lib/clients/firebase";
import { type Env, env } from "@/lib/env";
import type {
  FirebaseCredentials,
  ICreateFileOptions,
  IStorageStrategy,
} from "@/lib/storageStrategies/types";

export class FirebaseStorageStrategy implements IStorageStrategy {
  private firebase: Firebase;

  constructor() {
    this.firebase = new Firebase(
      FirebaseStorageStrategy.getFirebaseCredentials(),
    );
  }

  async exists(key: string): Promise<boolean> {
    return this.firebase.exists(key);
  }

  async delete(key: string): Promise<boolean> {
    await this.firebase.delete(key);
    return true;
  }

  async create(opts: ICreateFileOptions) {
    await this.firebase.upload(opts.key, opts.data.toString());
  }

  async get(key: string): Promise<Buffer> {
    const contents = await this.firebase.read(key);
    return Buffer.from(contents);
  }

  async getStream(key: string) {
    return this.firebase.getStream(key);
  }

  private static getFirebaseCredentials(): FirebaseCredentials {
    if (env.STORAGE_STRATEGY !== "firebase") {
      // should never happen normally
      throw new Error("Invalid storage strategy");
    }

    const requiredEnvVars: Array<keyof Env> = [
      "FIREBASE_BUCKET",
      "FIREBASE_SERVICE_ACCOUNT",
    ];

    for (const envVar of requiredEnvVars) {
      if (!env[envVar]) {
        throw new Error(
          `Missing required environment variable for Firebase storage strategy: ${envVar}`,
        );
      }
    }

    return {
      bucketName: env.FIREBASE_BUCKET as string,
      serviceAccount: env.FIREBASE_SERVICE_ACCOUNT as string,
    };
  }
}
