import Firebase from '@/lib/firebase';
import IStorageStrategy from './IStorageStrategy';

class FirebaseStorageStrategy implements IStorageStrategy {
  async create(params) {
    await new Firebase().upload(params.key, params.contents);
  }

  async get(key: string) {
    return new Firebase().read(key);
  }

  getStream(key: string) {
    return new Firebase().getStream(key);
  }

  async exists(key: string) {
    return new Firebase().exists(key);
  }
}

export default FirebaseStorageStrategy;
