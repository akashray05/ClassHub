import { useEffect, useState } from "react";
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import type { AxiosError } from "axios";

import {
  getTrashFiles,
  restoreFile,
  permanentlyDeleteFile,
} from "@/services/file";
import type { FileItem } from "@/types/file";
import type { MessageResponse } from "@/types/auth";

import { AppCard, AppButton } from "@/components/app";
import { FileTypeIcon } from "@/components/files";
import { formatBytes } from "@/utils";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function TrashPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<number | null>(null);

  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadTrash() {
    try {
      const data = await getTrashFiles();
      setFiles(data.files);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrash();
  }, []);

  async function handleRestore(file: FileItem) {
    setRestoringId(file.id);

    try {
      await restoreFile(file.id);

      toast.add({
        title: "File restored",
        description: `"${file.original_name}" was restored.`,
        type: "success",
      });

      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Restore failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not restore this file.",
        type: "error",
      });
    } finally {
      setRestoringId(null);
    }
  }

  function openDeleteDialog(file: FileItem) {
    setFileToDelete(file);
    setIsDeleteOpen(true);
  }

  async function handlePermanentDelete() {
    if (!fileToDelete) return;

    setIsDeleting(true);

    try {
      await permanentlyDeleteFile(fileToDelete.id);

      toast.add({
        title: "File deleted permanently",
        description: `"${fileToDelete.original_name}" has been permanently removed.`,
        type: "success",
      });

      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setIsDeleteOpen(false);
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Delete failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not permanently delete this file.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-10 text-white">
      <div className="flex items-center gap-3 mb-2">
        <Trash2 className="h-8 w-8 text-cyan-400" />
        <h1 className="text-4xl font-bold text-cyan-400">Trash</h1>
      </div>

      <p className="text-slate-400 mb-8">
        Files here will remain until you restore or permanently delete them.
      </p>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Trash2 className="h-20 w-20 text-slate-600" />

          <h2 className="mt-6 text-2xl font-semibold text-white">
            Trash is empty
          </h2>

          <p className="mt-2 text-slate-400 text-center max-w-md">
            Deleted files will show up here so you can restore or permanently
            remove them.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {files.map((file) => (
            <AppCard
              key={file.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <FileTypeIcon
                  filename={file.original_name}
                  className="h-10 w-10 shrink-0"
                />

                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {file.original_name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {formatBytes(file.file_size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <AppButton
                  size="icon"
                  variant="outline"
                  disabled={restoringId === file.id}
                  onClick={() => handleRestore(file)}
                  aria-label="Restore file"
                >
                  <RotateCcw className="h-4 w-4" />
                </AppButton>

                <AppButton
                  size="icon"
                  variant="outline"
                  onClick={() => openDeleteDialog(file)}
                  aria-label="Delete file permanently"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </AppButton>
              </div>
            </AppCard>
          ))}
        </div>
      )}

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <DialogTitle>Delete permanently</DialogTitle>
            </div>

            <DialogDescription>
              {fileToDelete
                ? `"${fileToDelete.original_name}" will be permanently deleted. This action cannot be undone.`
                : "This file will be permanently deleted. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handlePermanentDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
