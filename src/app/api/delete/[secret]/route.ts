import { decrypt } from "@/lib/secrets";
import { getStorageStrategy } from "@/lib/storageStrategies";

const storage = getStorageStrategy();

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ secret: string }> },
) {
  const secret = (await params).secret;

  try {
    const key = decrypt("id", secret);

    if (!(await storage.exists(key))) {
      return Response.json(
        {
          ok: false,
          error: "Snippet not found!",
        },
        { status: 404 },
      );
    }

    return Response.json({ ok: true, key });
  } catch (err) {
    return Response.json(
      { ok: false, error: "Failed to decrypt secret. Snippet not found." },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ secret: string }> },
) {
  const secret = (await params).secret;

  try {
    const key = decrypt("id", secret);

    if (!(await storage.exists(key))) {
      return Response.json(
        {
          ok: false,
          error: "Snippet not found!",
        },
        { status: 404 },
      );
    }

    await storage.delete(key);

    return Response.json({ ok: true, key });
  } catch (err) {
    return Response.json(
      { ok: false, error: "Failed to decrypt secret. Snippet not deleted." },
      { status: 400 },
    );
  }
}
