import { api } from "./api";
import type { PaginatedFiles } from "../types/file";

export async function getFolderFiles(folderId: number) {
  const response = await api.get<PaginatedFiles>(
    `/files/folder/${folderId}`
  );

  return response.data;
}

export async function uploadFile(
  folderId: number,
  file: File,
  onProgress?: (progress: number) => void
) {
  const form = new FormData();

  form.append("file", file);

  const response = await api.post(
    `/files/upload?folder_id=${folderId}`,
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress(event) {
        if (!event.total) return;

        const progress = Math.round(
          (event.loaded * 100) / event.total
        );

        onProgress?.(progress);
      },
    }
  );

  return response.data;
}