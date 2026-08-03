export type PreviewType =
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "text"
  | "unknown";

export interface PreviewFile {
  id: number;

  original_name: string;

  mime_type?: string;

  file_size: number;

  download_url: string;
}