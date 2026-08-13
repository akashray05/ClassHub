import { api } from "./api";
import type { FileItem, PaginatedFiles, DashboardSummary } from "../types/file";

export type SortBy = "name" | "date" | "size";
export type SortOrder = "asc" | "desc";

export async function getFolderFiles(
  folderId: number,
  page = 1,
  limit = 20,
  sortBy: SortBy = "date",
  sortOrder: SortOrder = "desc"
) {
  const response = await api.get<PaginatedFiles>(
    `/files/folder/${folderId}`,
    {
      params: {
        page,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    }
  );

  return response.data;
}

export async function searchFiles(
  query: string,
  page = 1,
  limit = 20,
  sortBy: SortBy = "date",
  sortOrder: SortOrder = "desc"
) {
  const response = await api.get<PaginatedFiles>("/files/search", {
    params: {
      q: query,
      page,
      limit,
      sort_by: sortBy,
      sort_order: sortOrder,
    },
  });

  return response.data;
}

export async function getTrashFiles(page = 1, limit = 20) {
  const response = await api.get<PaginatedFiles>("/files/trash", {
    params: { page, limit },
  });

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

export async function renameFile(
  fileId: number,
  originalName: string
): Promise<FileItem> {
  const response = await api.put<FileItem>(`/files/${fileId}`, {
    original_name: originalName,
  });

  return response.data;
}

export async function moveFile(
  fileId: number,
  folderId: number
): Promise<FileItem> {
  const response = await api.put<FileItem>(`/files/${fileId}/move`, {
    folder_id: folderId,
  });

  return response.data;
}

export async function deleteFile(
  fileId: number
): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(
    `/files/${fileId}`
  );

  return response.data;
}

export async function restoreFile(
  fileId: number
): Promise<{ message: string }> {
  const response = await api.put<{ message: string }>(
    `/files/restore/${fileId}`
  );

  return response.data;
}

export async function permanentlyDeleteFile(
  fileId: number
): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(
    `/files/permanent/${fileId}`
  );

  return response.data;
}

export async function downloadFile(
  fileId: number,
  fileName: string
): Promise<void> {
  const response = await api.get(`/files/download/${fileId}`, {
    responseType: "blob",
  });

  const blobUrl = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(blobUrl);
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<DashboardSummary>(
    "/files/dashboard-summary"
  );

  return response.data;
}
