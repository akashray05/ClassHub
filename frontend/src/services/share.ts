import { api } from "./api";
import type {
  SharedWithMeItem,
  SharedByMeItem,
} from "@/types/share";

export async function shareFile(
  fileId: number,
  sharedWithId: number,
  canDownload: boolean
): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(
    `/files/${fileId}/share`,
    {
      shared_with_id: sharedWithId,
      can_download: canDownload,
    }
  );

  return response.data;
}

export async function getSharedWithMe(): Promise<SharedWithMeItem[]> {
  const response = await api.get<SharedWithMeItem[]>(
    "/files/shared-with-me"
  );

  return response.data;
}

export async function getSharedByMe(): Promise<SharedByMeItem[]> {
  const response = await api.get<SharedByMeItem[]>(
    "/files/shared-by-me"
  );

  return response.data;
}

export async function removeShare(
  fileId: number,
  userId: number
): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(
    `/files/share/${fileId}/${userId}`
  );

  return response.data;
}

export async function updateSharePermission(
  fileId: number,
  userId: number,
  canDownload: boolean
): Promise<{ message: string; can_download: boolean }> {
  const response = await api.patch<{
    message: string;
    can_download: boolean;
  }>(`/files/share/${fileId}/${userId}`, {
    can_download: canDownload,
  });

  return response.data;
}

export async function downloadSharedFile(
  fileId: number,
  fileName: string
): Promise<void> {
  const response = await api.get(
    `/files/shared-download/${fileId}`,
    {
      responseType: "blob",
    }
  );

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
