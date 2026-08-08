import { api } from "./api";
import type { Folder } from "@/types/folder";

export async function getFolders(): Promise<Folder[]> {
  const response = await api.get<Folder[]>("/folders/");
  return response.data;
}

export async function createFolder(
  name: string,
  description?: string
): Promise<Folder> {
  const response = await api.post<Folder>("/folders/", {
    name,
    description,
  });

  return response.data;
}

export async function renameFolder(
  folderId: number,
  name: string
): Promise<Folder> {
  const response = await api.put<Folder>(`/folders/${folderId}`, {
    name,
  });

  return response.data;
}

export async function deleteFolder(folderId: number): Promise<void> {
  await api.delete(`/folders/${folderId}`);
}