import { useState } from "react";
import type { AxiosError } from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import { shareFile } from "@/services/share";
import { lookupUserByEmail } from "@/services/user";
import type { FileItem } from "@/types/file";
import type { MessageResponse } from "@/types/auth";

type Props = {
  files: FileItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShared: () => void;
};

export default function ShareFileDialog({
  files,
  open,
  onOpenChange,
  onShared,
}: Props) {
  const [email, setEmail] = useState("");
  const [canDownload, setCanDownload] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBulk = files.length > 1;

  function resetAndClose() {
    setEmail("");
    setCanDownload(true);
    onOpenChange(false);
  }

  async function handleShare() {
    if (files.length === 0) {
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      toast.add({
        title: "Email required",
        description: "Enter the ClassHub email address to share with.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const recipient = await lookupUserByEmail(trimmedEmail);

      let successCount = 0;
      let firstError: string | null = null;

      for (const file of files) {
        try {
          await shareFile(file.id, recipient.id, canDownload);
          successCount += 1;
        } catch (err) {
          const axiosErr = err as AxiosError<MessageResponse>;

          firstError =
            axiosErr.response?.data?.detail ??
            axiosErr.response?.data?.message ??
            "Could not share this file.";
        }
      }

      if (successCount > 0) {
        toast.add({
          title: isBulk ? "Files shared" : "File shared",
          description: isBulk
            ? `${successCount} file${successCount > 1 ? "s" : ""} shared with ${recipient.name}.`
            : `"${files[0].original_name}" was shared with ${recipient.name}.`,
          type: "success",
        });

        onShared();
      }

      if (firstError) {
        toast.add({
          title:
            successCount > 0 ? "Some files couldn't be shared" : "Share failed",
          description: firstError,
          type: "error",
        });
      }

      if (successCount > 0) {
        resetAndClose();
      }
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Share failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not find a user with that email.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(next) : resetAndClose())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share {isBulk ? `${files.length} files` : "file"}</DialogTitle>
          <DialogDescription>
            {files.length === 0
              ? "Share this file with another ClassHub user."
              : isBulk
              ? `Share ${files.length} selected files with another ClassHub user.`
              : `Share "${files[0].original_name}" with another ClassHub user.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Recipient email</Label>

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="classmate@gmail.com"
              type="email"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleShare();
                }
              }}
            />

            <p className="text-xs text-muted-foreground">
              They must already have a ClassHub account with this email.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground/80">
            <input
              type="checkbox"
              checked={canDownload}
              onChange={(e) => setCanDownload(e.target.checked)}
              className="h-4 w-4 rounded border-border bg-muted accent-primary"
            />
            Allow this user to download the file{isBulk ? "s" : ""}
          </label>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={resetAndClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button onClick={handleShare} disabled={isSubmitting}>
            {isSubmitting ? "Sharing..." : isBulk ? `Share ${files.length} files` : "Share file"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
