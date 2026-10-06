"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export type CaptchaDialogProps = {
  open: boolean;
  siteKey: string;
  onOpenChange(open: boolean): void;
  onVerify(token: string): void;
};

export function CaptchaDialog({
  open,
  siteKey,
  onOpenChange,
  onVerify,
}: CaptchaDialogProps) {
  const captchaRef = useRef<HCaptcha>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!open) {
      captchaRef.current?.resetCaptcha();
    }
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify you are human</AlertDialogTitle>
          <AlertDialogDescription>
            Please complete the challenge to save your snippet.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center py-2">
          <HCaptcha
            ref={captchaRef}
            sitekey={siteKey}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            onVerify={(token) => {
              console.log("[captcha] hCaptcha challenge solved on the client.", {
                tokenLength: token?.length ?? 0,
              });
              onVerify(token);
            }}
            onError={(err) => {
              console.error("[captcha] hCaptcha widget error.", err);
            }}
            onExpire={() => {
              console.warn("[captcha] hCaptcha token expired; resetting.");
              captchaRef.current?.resetCaptcha();
            }}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
