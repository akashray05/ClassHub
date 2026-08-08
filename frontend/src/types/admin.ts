export interface AdminUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  is_verified: boolean;
  storage_used: number;
  storage_quota: number;
  file_count: number;
  folder_count: number;
  created_at: string;
}

export interface AdminUserList {
  page: number;
  limit: number;
  total: number;
  pages: number;
  users: AdminUser[];
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  verified_users: number;
  admin_users: number;
  total_folders: number;
  total_files: number;
  total_storage_used: number;
  total_storage_quota: number;
  total_shares: number;
}
