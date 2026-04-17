import { getStorageStrategy } from "@/lib/storageStrategies";

const storage = getStorageStrategy();

export async function getDocument(key: string) {
  return storage.get(key);
}

export async function getDocumentStream(key: string) {
  return storage.getStream(key);
}
