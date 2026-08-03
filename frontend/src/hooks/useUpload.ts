import { useState } from "react";

import { uploadFile } from "@/services/file";

interface UseUploadProps {
  folderId: number;
  onSuccess?: () => void;
}

export function useUpload({
  folderId,
  onSuccess,
}: UseUploadProps) {
  const [uploading, setUploading] = useState(false);

  async function upload(files: FileList) {
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        await uploadFile(folderId, file);
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return {
    uploading,
    upload,
  };
}