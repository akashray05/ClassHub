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
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import { deleteFile } from "@/services/file";
import type { FileItem } from "@/types/file";
import type { MessageResponse } from "@/types/auth";

type Props = {
  files: FileItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: (fileIds: number[]) => void;
};

export default function DeleteFileDialog({
  files,
  open,
  onOpenChange,
  onDeleted,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const isBulk = files.length > 1;

  async function handleDelete() {
    if (files.length === 0) {
      return;
    }

    setIsDeleting(true);

    const succeeded: number[] = [];
    let firstError: string | null = null;

    for (const file of files) {
      try {
        await deleteFile(file.id);
        succeeded.push(file.id);
      } catch (err) {
        const axiosErr = err as AxiosError<MessageResponse>;

        firstError =
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not delete this file.";
      }
    }

    setIsDeleting(false);

    if (succeeded.length > 0) {
      toast.add({
        title: "Moved to trash",
        description: isBulk
          ? `${succeeded.length} file${succeeded.length > 1 ? "s" : ""} moved to trash.`
          : `"${files[0].original_name}" was moved to trash.`,
        type: "success",
      });

      onDeleted(succeeded);
    }

    if (firstError) {
      toast.add({
        title:
          succeeded.length > 0
            ? "Some files couldn't be deleted"
            : "Delete failed",
        description: firstError,
        type: "error",
      });
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move to trash</DialogTitle>
          <DialogDescription>
            {files.length === 0
              ? "Move this file to trash?"
              : isBulk
              ? `Move ${files.length} files to trash? You can restore them later from the Trash page.`
              : `Move "${files[0].original_name}" to trash? You can restore it later from the Trash page.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting
              ? "Moving..."
              : isBulk
              ? `Move ${files.length} files to trash`
              : "Move to trash"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
