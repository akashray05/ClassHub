import { useCallback, useState } from "react";

import { uploadFile } from "@/services/file";
import type { UploadItem, UploadStatus } from "../types/upload";

interface UseUploadManagerProps {
  folderId: number;
  onSuccess?: () => void;
}

export function useUploadManager({
  folderId,
  onSuccess,
}: UseUploadManagerProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  function updateItem(id: string, patch: Partial<UploadItem>) {
    setUploads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  async function runUpload(item: UploadItem) {
    updateItem(item.id, { status: "uploading" as UploadStatus });

    const startedAt = Date.now();

    try {
      await uploadFile(folderId, item.file, (progress) => {
        const uploadedBytes = Math.round(
          (progress / 100) * item.totalBytes
        );

        const elapsedSeconds = Math.max(
          (Date.now() - startedAt) / 1000,
          0.1
        );

        const speed = uploadedBytes / elapsedSeconds;

        const remainingBytes = item.totalBytes - uploadedBytes;

        const eta = speed > 0 ? Math.round(remainingBytes / speed) : 0;

        updateItem(item.id, {
          progress,
          uploadedBytes,
          speed,
          eta,
        });
      });

      updateItem(item.id, {
        status: "success" as UploadStatus,
        progress: 100,
        uploadedBytes: item.totalBytes,
      });

      onSuccess?.();
    } catch (error) {
      console.error(error);

      updateItem(item.id, {
        status: "error" as UploadStatus,
        error: "Upload failed. Please try again.",
      });
    }
  }

  const addFiles = useCallback(
    (files: File[]) => {
      const items: UploadItem[] = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        progress: 0,
        speed: 0,
        eta: 0,
        uploadedBytes: 0,
        totalBytes: file.size,
        status: "queued",
      }));

      setUploads((prev) => [...prev, ...items]);

      items.forEach((item) => {
        runUpload(item);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [folderId]
  );

  function removeUpload(id: string) {
    setUploads((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCompleted() {
    setUploads((prev) => prev.filter((u) => u.status !== "success"));
  }

  return {
    uploads,
    addFiles,
    removeUpload,
    clearCompleted,
    setUploads,
  };
}
