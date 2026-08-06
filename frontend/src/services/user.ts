import { api } from "./api";
import type { UserResponse, StorageInfo } from "@/types/auth";

export async function getCurrentUser(): Promise<UserResponse> {
  const response = await api.get<UserResponse>("/users/me");

  return response.data;
}

export async function getStorage(): Promise<StorageInfo> {
  const response = await api.get<StorageInfo>("/users/storage");

  return response.data;
}
