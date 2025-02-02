"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type DeleteSnippetAlertProps = {
  snippetKey: string;
  token: string;
};

export function DeleteSnippetAlert({
  snippetKey,
  token,
}: DeleteSnippetAlertProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [requestInProgress, setRequestInProgress] = useState(false);

  const router = useRouter();

  function handleCancelClick() {
    router.push(`/${snippetKey}`);
  }

  async function handleActionClick() {
    if (requestInProgress) {
      return;
    }

    setRequestInProgress(true);

    try {
      const response = await fetch(`/api/delete/${token}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete snippet.");
      }

      toast.success("Snippet deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting the snippet.");
    } finally {
      router.push("/");
    }
  }

  useEffect(() => {
    if (triggerRef.current) {
      triggerRef.current.click();
    }
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger ref={triggerRef} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Snippet?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the snippet{" "}
            <a
              href={`/${snippetKey}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 font-bold hover:underline underline-offset-4"
            >
              {snippetKey}
            </a>
            ? This action is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancelClick}
            disabled={requestInProgress}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleActionClick}
            disabled={requestInProgress}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
