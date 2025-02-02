import { env } from "@/lib/env";
import { FileStorageStrategy } from "@/lib/storageStrategies/FileStorageStrategy";
import { FirebaseStorageStrategy } from "@/lib/storageStrategies/FirebaseStorageStrategy";
import { R2StorageStrategy } from "@/lib/storageStrategies/R2StorageStrategy";
import { S3StorageStrategy } from "@/lib/storageStrategies/S3StorageStrategy";

function getStorageStrategy() {
  const strategy = env.STORAGE_STRATEGY;

  switch (strategy) {
    case "file":
      return new FileStorageStrategy();
    case "firebase":
      return new FirebaseStorageStrategy();
    case "s3":
      return new S3StorageStrategy();
    case "r2":
      return new R2StorageStrategy();
  }
}

export {
  getStorageStrategy,
  FileStorageStrategy,
  S3StorageStrategy,
  FirebaseStorageStrategy,
  R2StorageStrategy,
};
