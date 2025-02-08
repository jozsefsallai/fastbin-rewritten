import { env } from "@/lib/env";
import type { FirebaseCredentials } from "@/lib/storageStrategies/types";
import type { Bucket } from "@google-cloud/storage";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

function initFirebaseStorage(credentials: FirebaseCredentials) {
  const bucket = env.FIREBASE_BUCKET?.replace(".appspot.com", "");

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(JSON.parse(credentials.serviceAccount)),
      storageBucket: `${bucket}.appspot.com`,
    });
  }

  return getStorage().bucket();
}

export class Firebase {
  private storage: Bucket;

  constructor(credentials: FirebaseCredentials) {
    this.storage = initFirebaseStorage(credentials);
  }

  async exists(key: string): Promise<boolean> {
    return this.storage
      .file(key)
      .exists()
      .then((data) => data[0]);
  }

  async upload(key: string, contents: string, metadata?: Record<string, any>) {
    const file = this.storage.file(key);
    return file.save(contents, {
      metadata,
    });
  }

  getStream(key: string) {
    const file = this.storage.file(key);
    return file.createReadStream();
  }

  async read(key: string): Promise<string> {
    const file = this.storage.file(key);

    return file.download().then((contents) => contents[0].toString());
  }

  async delete(key: string) {
    const file = this.storage.file(key);
    return file.delete();
  }
}
