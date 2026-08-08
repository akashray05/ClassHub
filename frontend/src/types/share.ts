export interface SharedWithMeItem {
  file_id: number;
  original_name: string;
  file_size: number;
  owner_name: string;
  owner_email: string;
  shared_at: string;
  can_download: boolean;
}

export interface SharedUser {
  id: number;
  name: string;
  email: string;
}

export interface SharedByMeItem {
  file_id: number;
  original_name: string;
  shared_with: SharedUser[];
}

export interface ShareFilePayload {
  shared_with_id: number;
  can_download: boolean;
}

export interface UpdateSharePermissionPayload {
  can_download: boolean;
}
