import * as fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import * as path from "node:path";
import { env } from "@/lib/env";
import type {
  ICreateFileOptions,
  IStorageStrategy,
} from "@/lib/storageStrategies/types";
import type { Readable } from "node:stream";

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
    return fs.readFile(filePath);
  }

  async getStream(key: string): Promise<Readable> {
    const filePath = path.join(STORAGE_ROOT, key);
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
