import { env } from "@/lib/env";
import { encrypt } from "@/lib/secrets";
import { getStorageStrategy } from "@/lib/storageStrategies";
import { init as initCuid } from "@paralleldrive/cuid2";
import type { NextRequest } from "next/server";

const storage = getStorageStrategy();

const createId = initCuid({
  length: 8,
});

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("Content-Type") ?? "";
  let contents: string;

  if (contentType.includes("application/json")) {
    const body = (await req.json()) as { contents?: unknown };
    if (typeof body.contents !== "string") {
      return Response.json(
        { ok: false, error: "Expected JSON body { contents: string }." },
        { status: 400 },
      );
    }
    contents = body.contents;
  } else {
    contents = await req.text();
  }

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

  const ip = (
    req.headers.get("CF-Connecting-IP") || req.headers.get("x-forwarded-for")
  )?.split(",")[0];

  try {
    let key = createId();
    let attempts = 0;
    const maxKeyAttempts = 24;

    while (await storage.exists(key)) {
      key = createId();
      if (++attempts > maxKeyAttempts) {
        return Response.json(
          { ok: false, error: "Failed to allocate a unique snippet id." },
          { status: 500 },
        );
      }
    }

    await storage.create({ key, data: contents, metadata: { ip } });

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
