import env from '@/lib/env';

import FileStorageStrategy from './FileStorageStrategy';
import S3StorageStrategy from './S3StorageStrategy';
import FirebaseStorageStrategy from './FirebaseStorageStrategy';

const getStorageStrategy = () => {
  const strategy = env('storage-strategy');

  switch (strategy) {
    case 'file':
      return new FileStorageStrategy();
    case 'firebase':
      return new FirebaseStorageStrategy();
    case 's3':
      return new S3StorageStrategy();
  }
};

export {
  FileStorageStrategy,
  S3StorageStrategy,
  FirebaseStorageStrategy,

  getStorageStrategy
};
