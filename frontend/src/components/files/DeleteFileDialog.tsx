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
  file: FileItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: (fileId: number) => void;
};

export default function DeleteFileDialog({
  file,
  open,
  onOpenChange,
  onDeleted,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!file) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteFile(file.id);

      toast.add({
        title: "Moved to trash",
        description: `"${file.original_name}" was moved to trash.`,
        type: "success",
      });

      onDeleted(file.id);
      onOpenChange(false);
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Delete failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not delete the file.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move to trash</DialogTitle>
          <DialogDescription>
            {file
              ? `Move "${file.original_name}" to trash? You can restore it later from the Trash page.`
              : "Move this file to trash?"}
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
            {isDeleting ? "Moving..." : "Move to trash"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
