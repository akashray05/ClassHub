import {
  File,
  FileText,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  FileAudio,
  FileImage,
  FileVideo,
  Presentation,
} from "lucide-react";

import { getFileType } from "@/utils";

interface FileTypeIconProps {
  filename: string;
  className?: string;
}

export function FileTypeIcon({
  filename,
  className,
}: FileTypeIconProps) {
  const type = getFileType(filename);

  switch (type) {
    case "pdf":
      return (
        <FileText
          className={`text-red-500 ${className ?? ""}`}
        />
      );

    case "image":
      return (
        <FileImage
          className={`text-green-500 ${className ?? ""}`}
        />
      );

    case "video":
      return (
        <FileVideo
          className={`text-purple-500 ${className ?? ""}`}
        />
      );

    case "audio":
      return (
        <FileAudio
          className={`text-pink-500 ${className ?? ""}`}
        />
      );

    case "archive":
      return (
        <FileArchive
          className={`text-yellow-500 ${className ?? ""}`}
        />
      );

    case "spreadsheet":
      return (
        <FileSpreadsheet
          className={`text-emerald-500 ${className ?? ""}`}
        />
      );

    case "presentation":
      return (
        <Presentation
          className={`text-orange-500 ${className ?? ""}`}
        />
      );

    case "code":
      return (
        <FileCode
          className={`text-cyan-500 ${className ?? ""}`}
        />
      );

    case "document":
    case "text":
      return (
        <FileText
          className={`text-blue-500 ${className ?? ""}`}
        />
      );

    default:
      return (
        <File
          className={`text-slate-400 ${className ?? ""}`}
        />
      );
  }
}