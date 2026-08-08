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

import { deleteFolder } from "@/services/folder";
import type { Folder } from "@/types/folder";
import type { MessageResponse } from "@/types/auth";

type Props = {
  folder: Folder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: (folderId: number) => void;
};

export default function DeleteFolderDialog({
  folder,
  open,
  onOpenChange,
  onDeleted,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!folder) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteFolder(folder.id);

      toast.add({
        title: "Folder deleted",
        description: `"${folder.name}" has been deleted.`,
        type: "success",
      });

      onDeleted(folder.id);
      onOpenChange(false);
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Delete failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not delete the folder.",
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
          <DialogTitle>Delete folder</DialogTitle>
          <DialogDescription>
            {folder
              ? `Are you sure you want to delete "${folder.name}"? This action cannot be undone.`
              : "Are you sure you want to delete this folder?"}
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
            {isDeleting ? "Deleting..." : "Delete folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
