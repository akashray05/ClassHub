export type FileType =
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "code"
  | "text"
  | "unknown";

export function getFileType(filename: string): FileType {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "";

  if (["pdf"].includes(extension)) return "pdf";

  if (
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(extension)
  )
    return "image";

  if (
    ["mp4", "mkv", "mov", "avi", "webm"].includes(extension)
  )
    return "video";

  if (
    ["mp3", "wav", "ogg", "flac", "aac"].includes(extension)
  )
    return "audio";

  if (
    ["zip", "rar", "7z", "tar", "gz"].includes(extension)
  )
    return "archive";

  if (
    ["doc", "docx", "odt"].includes(extension)
  )
    return "document";

  if (
    ["xls", "xlsx", "csv"].includes(extension)
  )
    return "spreadsheet";

  if (
    ["ppt", "pptx"].includes(extension)
  )
    return "presentation";

  if (
    [
      "js",
      "ts",
      "tsx",
      "jsx",
      "py",
      "java",
      "cpp",
      "c",
      "go",
      "rs",
      "php",
      "html",
      "css",
      "json",
      "xml",
      "sql",
      "sh",
    ].includes(extension)
  )
    return "code";

  if (
    ["txt", "md", "log"].includes(extension)
  )
    return "text";

  return "unknown";
}