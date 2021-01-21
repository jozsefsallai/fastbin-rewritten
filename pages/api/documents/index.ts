import env from '@/lib/env';
import { getStorageStrategy } from '@/lib/storageStrategies';
import { NextApiRequest, NextApiResponse } from 'next';

import cuid from 'cuid';
import { encrypt } from '@/lib/secrets';

const storage = getStorageStrategy();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: env('limits.max-payload-size') || '10mb'
    }
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed.'
    });
  }

  const contents = typeof req.body === 'string'
    ? req.body
    : req.body && Object.keys(req.body)[0];

  if (!contents || !contents.length) {
    return res.status(422).json({
      ok: false,
      error: 'Contents is too short.'
    });
  }

  const maxLength = parseInt(env('limits.max-body-length'), 10);

  if (contents.length > maxLength) {
    return res.status(422).json({
      ok: false,
      error: `Your snippet needs to be less than ${maxLength} characters long.`
    });
  }

  try {
    let key: string | null = null;

    do {
      key = cuid.slug();
    } while (await storage.exists(key));

    await storage.create({ key, contents });

    const secret = encrypt('id', key);

    return res.json({ ok: true, key, secret });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false });
  }
};
