import type { PreviewType } from "../types/preview";

export function getPreviewType(
  filename: string
): PreviewType {
  const ext =
    filename.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "pdf") return "pdf";

  if (
    [
      "png",
      "jpg",
      "jpeg",
      "gif",
      "svg",
      "webp",
      "bmp",
    ].includes(ext)
  )
    return "image";

  if (
    [
      "mp4",
      "mkv",
      "mov",
      "avi",
      "webm",
    ].includes(ext)
  )
    return "video";

  if (
    [
      "mp3",
      "wav",
      "aac",
      "ogg",
      "flac",
    ].includes(ext)
  )
    return "audio";

  if (
    [
      "txt",
      "md",
      "json",
      "xml",
      "js",
      "ts",
      "tsx",
      "jsx",
      "py",
      "java",
      "cpp",
      "c",
      "css",
      "html",
    ].includes(ext)
  )
    return "text";

  return "unknown";
}