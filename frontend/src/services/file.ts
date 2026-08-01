import { api } from "./api";
import type { PaginatedFiles } from "../types/file";

export async function getFolderFiles(folderId: number) {
  const response = await api.get<PaginatedFiles>(
    `/files/folder/${folderId}`
  );

  return response.data;
}