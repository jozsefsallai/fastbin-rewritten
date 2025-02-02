import { env } from "@/lib/env";
import { encrypt } from "@/lib/secrets";
import { getStorageStrategy } from "@/lib/storageStrategies";
import { init as initCuid } from "@paralleldrive/cuid2";

const storage = getStorageStrategy();

const createId = initCuid({
  length: 8,
});

export async function POST(req: Request) {
  const contents =
    req.headers.get("Content-Type") === "application/json"
      ? Object.keys(await req.json())[0]
      : await req.text();

  if (!contents || contents.length === 0) {
    return Response.json(
      {
        ok: false,
        error: "Contents is too short",
      },
      { status: 422 },
    );
  }

  const maxLength = env.LIMITS_MAX_BODY_LENGTH;

  if (contents.length > maxLength) {
    return Response.json(
      {
        ok: false,
        error: `Your snippet needs to be less than ${maxLength} characters long.`,
      },
      { status: 422 },
    );
  }

  try {
    let key: string | null = null;

    do {
      key = createId();
    } while (await storage.exists(key));

    await storage.create({ key, data: contents });

    const secret = encrypt("id", key);

    return Response.json({ ok: true, key, secret });
  } catch (err) {
    console.error(err);
    return Response.json(
      { ok: false, error: "Failed to create snippet." },
      { status: 500 },
    );
  }
}
