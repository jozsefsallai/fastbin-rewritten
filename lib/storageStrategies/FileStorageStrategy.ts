import * as fs from 'fs-extra';
import * as path from 'path';
import env from '@/lib/env';
import IStorageStrategy from './IStorageStrategy';

const STORAGE_ROOT = path.join(process.cwd(), env('file-storage.location') || 'storage');

class FileStorageStrategy implements IStorageStrategy {
  async create(params) {
    const { key, contents } = params;
    const filePath = path.join(STORAGE_ROOT, key);
    await fs.writeFile(filePath, contents, { encoding: 'utf8' });
  }

  async get(key) {
    return fs.readFile(path.join(STORAGE_ROOT, key), { encoding: 'utf8' });
  }

  getStream(key) {
    const filePath = path.join(STORAGE_ROOT, key);
    return fs.createReadStream(filePath);
  }

  async exists(key) {
    return fs.pathExists(path.join(STORAGE_ROOT, key));
  }
}

export default FileStorageStrategy;
