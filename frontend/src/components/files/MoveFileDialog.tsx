import { useEffect, useState } from "react";
import { Folder as FolderIcon } from "lucide-react";
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

import { moveFile } from "@/services/file";
import { getFolders } from "@/services/folder";
import type { FileItem } from "@/types/file";
import type { Folder } from "@/types/folder";
import type { MessageResponse } from "@/types/auth";
import { cn } from "@/lib/utils";

type Props = {
  file: FileItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMoved: (fileId: number) => void;
};

export default function MoveFileDialog({
  file,
  open,
  onOpenChange,
  onMoved,
}: Props) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedFolderId(null);
    setIsLoadingFolders(true);

    getFolders()
      .then(setFolders)
      .catch((error) => {
        console.error(error);

        toast.add({
          title: "Could not load folders",
          description: "Please try again.",
          type: "error",
        });
      })
      .finally(() => setIsLoadingFolders(false));
  }, [open]);

  async function handleMove() {
    if (!file || selectedFolderId === null) {
      return;
    }

    setIsSubmitting(true);

    try {
      await moveFile(file.id, selectedFolderId);

      const destination = folders.find((f) => f.id === selectedFolderId);

      toast.add({
        title: "File moved",
        description: destination
          ? `"${file.original_name}" was moved to "${destination.name}".`
          : `"${file.original_name}" was moved.`,
        type: "success",
      });

      onMoved(file.id);
      onOpenChange(false);
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Move failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not move this file.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const otherFolders = folders.filter(
    (folder) => folder.id !== file?.folder_id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move file</DialogTitle>
          <DialogDescription>
            {file
              ? `Choose a destination folder for "${file.original_name}".`
              : "Choose a destination folder."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-72 overflow-y-auto space-y-1">
          {isLoadingFolders ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Loading folders...
            </p>
          ) : otherFolders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No other folders to move this file into.
            </p>
          ) : (
            otherFolders.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => setSelectedFolderId(folder.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  selectedFolderId === folder.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
              >
                <FolderIcon size={16} className="shrink-0" />
                <span className="truncate">{folder.name}</span>
              </button>
            ))
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            onClick={handleMove}
            disabled={isSubmitting || selectedFolderId === null}
          >
            {isSubmitting ? "Moving..." : "Move here"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
