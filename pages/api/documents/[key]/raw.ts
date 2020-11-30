import { getStorageStrategy } from '@/lib/storageStrategies';
import { NextApiRequest, NextApiResponse } from 'next';

const storage = getStorageStrategy();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const key = req.query.key as string;

  if (!(await storage.exists(key))) {
    return res.status(404).json({
      ok: false,
      error: 'File does not exist.'
    });
  }

  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });

  const stream = storage.getStream(key);
  return stream.pipe(res);
};
