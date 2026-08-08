import { useEffect, useState } from "react";
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

import { renameFile } from "@/services/file";
import type { FileItem } from "@/types/file";
import type { MessageResponse } from "@/types/auth";

type Props = {
  file: FileItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRenamed: (file: FileItem) => void;
};

export default function RenameFileDialog({
  file,
  open,
  onOpenChange,
  onRenamed,
}: Props) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (file) {
      setName(file.original_name);
    }
  }, [file]);

  async function handleRename() {
    if (!file) {
      return;
    }

    const trimmed = name.trim();

    if (!trimmed) {
      toast.add({
        title: "File name required",
        description: "Please enter a name for the file.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updated = await renameFile(file.id, trimmed);

      toast.add({
        title: "File renamed",
        description: `Renamed to "${updated.original_name}".`,
        type: "success",
      });

      onRenamed(updated);
      onOpenChange(false);
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Rename failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not rename the file.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
          <DialogDescription>
            Choose a new name for this file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>File name</Label>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="File name"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleRename();
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button onClick={handleRename} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
