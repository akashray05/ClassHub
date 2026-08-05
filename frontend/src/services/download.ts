const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:8000";

export function getDownloadUrl(fileId: number) {
  return `${API_URL}/files/download/${fileId}`;
}