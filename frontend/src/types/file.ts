export interface FileItem {
  id: number;
  original_name: string;
  file_size: number;
  mime_type: string;
  folder_id: number;
  owner_id: number;
  created_at: string;
}

export interface PaginatedFiles {
  page: number;
  limit: number;
  total: number;
  pages: number;
  files: FileItem[];
}