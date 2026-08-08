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

export async function lookupUserByEmail(
  email: string
): Promise<UserResponse> {
  const response = await api.get<UserResponse>("/users/lookup", {
    params: { email },
  });

  return response.data;
}

export async function updateProfile(
  name: string
): Promise<UserResponse> {
  const response = await api.put<UserResponse>("/users/me", { name });

  return response.data;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(
    "/users/change-password",
    {
      current_password: currentPassword,
      new_password: newPassword,
    }
  );

  return response.data;
}
