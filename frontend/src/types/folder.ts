export interface Folder {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  created_at: string;
  updated_at: string;
}