import { api } from "./api";

export async function getFolders() {
  const response = await api.get("/folders/");
  return response.data;
}

export async function createFolder(
  name: string,
  description?: string
) {
  const response = await api.post("/folders/", {
    name,
    description,
  });

  return response.data;
}