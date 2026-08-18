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
  files: FileItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMoved: (fileIds: number[]) => void;
  onUndo?: () => void;
};

export default function MoveFileDialog({
  files,
  open,
  onOpenChange,
  onMoved,
  onUndo,
}: Props) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBulk = files.length > 1;

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

  async function handleUndo(
    originalLocations: { fileId: number; folderId: number }[]
  ) {
    try {
      for (const { fileId, folderId } of originalLocations) {
        await moveFile(fileId, folderId);
      }

      toast.add({
        title: "Move undone",
        description:
          originalLocations.length > 1
            ? `${originalLocations.length} files moved back.`
            : "File moved back.",
        type: "success",
      });

      onUndo?.();
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Undo failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not move these files back.",
        type: "error",
      });
    }
  }

  async function handleMove() {
    if (files.length === 0 || selectedFolderId === null) {
      return;
    }

    setIsSubmitting(true);

    const destination = folders.find((f) => f.id === selectedFolderId);
    const succeeded: number[] = [];
    const originalLocations: { fileId: number; folderId: number }[] = [];
    let firstError: string | null = null;

    for (const file of files) {
      try {
        await moveFile(file.id, selectedFolderId);
        succeeded.push(file.id);
        originalLocations.push({ fileId: file.id, folderId: file.folder_id });
      } catch (err) {
        const axiosErr = err as AxiosError<MessageResponse>;

        firstError =
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not move this file.";
      }
    }

    setIsSubmitting(false);

    if (succeeded.length > 0) {
      toast.add({
        title: isBulk ? "Files moved" : "File moved",
        description: destination
          ? isBulk
            ? `${succeeded.length} file${succeeded.length > 1 ? "s" : ""} moved to "${destination.name}".`
            : `"${files[0].original_name}" was moved to "${destination.name}".`
          : "Files moved.",
        type: "success",
        actionProps: {
          children: "Undo",
          onClick: () => handleUndo(originalLocations),
        },
      });

      onMoved(succeeded);
    }

    if (firstError) {
      toast.add({
        title: succeeded.length > 0 ? "Some files couldn't be moved" : "Move failed",
        description: firstError,
        type: "error",
      });
    }

    onOpenChange(false);
  }

  const excludedFolderId = !isBulk ? files[0]?.folder_id : undefined;

  const otherFolders = folders.filter(
    (folder) => folder.id !== excludedFolderId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move {isBulk ? `${files.length} files` : "file"}</DialogTitle>
          <DialogDescription>
            {files.length === 0
              ? "Choose a destination folder."
              : isBulk
              ? `Choose a destination folder for ${files.length} selected files.`
              : `Choose a destination folder for "${files[0].original_name}".`}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-72 overflow-y-auto space-y-1">
          {isLoadingFolders ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Loading folders...
            </p>
          ) : otherFolders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No other folders to move into.
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
