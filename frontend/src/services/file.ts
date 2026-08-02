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
  file: File 
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
    }
  );

  return response.data;
}