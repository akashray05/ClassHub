import { api } from "./api";
import type { AdminUser, AdminUserList, AdminStats } from "@/types/admin";

export async function getAdminStats(): Promise<AdminStats> {
  const response = await api.get<AdminStats>("/admin/stats");
  return response.data;
}

export async function listAdminUsers(
  page = 1,
  limit = 20
): Promise<AdminUserList> {
  const response = await api.get<AdminUserList>("/admin/users", {
    params: { page, limit },
  });

  return response.data;
}

export async function updateUserStatus(
  userId: number,
  isActive: boolean
): Promise<AdminUser> {
  const response = await api.patch<AdminUser>(
    `/admin/users/${userId}/status`,
    { is_active: isActive }
  );

  return response.data;
}

export async function updateUserRole(
  userId: number,
  isAdmin: boolean
): Promise<AdminUser> {
  const response = await api.patch<AdminUser>(
    `/admin/users/${userId}/role`,
    { is_admin: isAdmin }
  );

  return response.data;
}

export async function deleteAdminUser(
  userId: number
): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(
    `/admin/users/${userId}`
  );

  return response.data;
}
