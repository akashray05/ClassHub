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
  file: FileItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShared: () => void;
};

export default function ShareFileDialog({
  file,
  open,
  onOpenChange,
  onShared,
}: Props) {
  const [email, setEmail] = useState("");
  const [canDownload, setCanDownload] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetAndClose() {
    setEmail("");
    setCanDownload(true);
    onOpenChange(false);
  }

  async function handleShare() {
    if (!file) {
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

      await shareFile(file.id, recipient.id, canDownload);

      toast.add({
        title: "File shared",
        description: `"${file.original_name}" was shared with ${recipient.name}.`,
        type: "success",
      });

      onShared();
      resetAndClose();
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Share failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not share this file.",
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
          <DialogTitle>Share file</DialogTitle>
          <DialogDescription>
            {file
              ? `Share "${file.original_name}" with another ClassHub user.`
              : "Share this file with another ClassHub user."}
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

            <p className="text-xs text-slate-500">
              They must already have a ClassHub account with this email.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={canDownload}
              onChange={(e) => setCanDownload(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-cyan-500"
            />
            Allow this user to download the file
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
            {isSubmitting ? "Sharing..." : "Share file"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
