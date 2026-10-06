import { env } from "@/lib/env";

export const hCaptchaSiteKey = env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

export const isCaptchaEnabled = Boolean(hCaptchaSiteKey);
