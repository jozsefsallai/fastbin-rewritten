import { env } from "@/lib/env";

type HCaptchaVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
  hostname?: string;
  challenge_ts?: string;
};

export function isCaptchaEnabled(): boolean {
  return Boolean(env.HCAPTCHA_SECRET && env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY);
}

export async function verifyCaptcha(
  token: string | null | undefined,
  remoteIp?: string,
): Promise<boolean> {
  const hasSecret = Boolean(env.HCAPTCHA_SECRET);
  const hasSiteKey = Boolean(env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY);

  if (hasSecret !== hasSiteKey) {
    console.warn(
      "[captcha] Misconfigured: only one of HCAPTCHA_SECRET / NEXT_PUBLIC_HCAPTCHA_SITE_KEY is set. " +
        "hCaptcha is treated as disabled. Set both to enforce it.",
      { hasSecret, hasSiteKey },
    );
  }

  if (!isCaptchaEnabled()) {
    console.log("[captcha] Verification skipped (captcha disabled).", {
      hasSecret,
      hasSiteKey,
      hasToken: Boolean(token),
    });
    return true;
  }

  if (!token) {
    return false;
  }

  const params = new URLSearchParams({
    secret: env.HCAPTCHA_SECRET as string,
    sitekey: env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY as string,
    response: token,
  });

  if (remoteIp) {
    params.set("remoteip", remoteIp);
  }

  try {

    const response = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      body: params,
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as HCaptchaVerifyResponse;

    if (data.success !== true) {
      console.error("[captcha] hCaptcha rejected the token.", {
        errorCodes: data["error-codes"] ?? [],
        hostname: data.hostname ?? null,
        challengeTs: data.challenge_ts ?? null,
        remoteIp: remoteIp ?? null,
      });
      return false;
    }

    return true;
  } catch (err) {
    console.error("[captcha] Failed to verify hCaptcha token.", err);
    return false;
  }
}
