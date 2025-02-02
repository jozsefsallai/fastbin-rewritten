import { getStorageStrategy } from "@/lib/storageStrategies";

const storage = getStorageStrategy();

export async function getDocument(key: string) {
  if (!(await storage.exists(key))) {
    return null;
  }

  const contents = await storage.get(key);
  return contents;
}

export async function getDocumentStream(key: string) {
  if (!(await storage.exists(key))) {
    return null;
  }

  const stream = await storage.getStream(key);
  return stream;
}
