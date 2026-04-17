import { createReadStream } from "node:fs";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { Readable } from "node:stream";
import { env } from "@/lib/env";
import type {
  ICreateFileOptions,
  IStorageStrategy,
} from "@/lib/storageStrategies/types";

const STORAGE_ROOT = path.join(
  process.cwd(),
  env.FILE_STORAGE_LOCATION ?? "storage",
);

export class FileStorageStrategy implements IStorageStrategy {
  async create(opts: ICreateFileOptions) {
    const { key, data } = opts;
    const filePath = path.join(STORAGE_ROOT, key);
    await fs.writeFile(filePath, data);
  }

  async get(key: string) {
    const filePath = path.join(STORAGE_ROOT, key);
    try {
      return await fs.readFile(filePath);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err as { code?: string }).code === "ENOENT"
      ) {
        return null;
      }
      throw err;
    }
  }

  async getStream(key: string): Promise<Readable | null> {
    const filePath = path.join(STORAGE_ROOT, key);
    try {
      await fs.access(filePath);
    } catch {
      return null;
    }
    return createReadStream(filePath);
  }

  async exists(key: string) {
    const filePath = path.join(STORAGE_ROOT, key);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async delete(key: string) {
    const filePath = path.join(STORAGE_ROOT, key);
    try {
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
