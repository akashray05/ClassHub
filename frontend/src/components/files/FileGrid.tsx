import { FileCard } from "./FileCard";
import type { FileItem } from "@/types/file";

interface FileGridProps {
  files: FileItem[];

  onDownload?: (file: FileItem) => void;

  onOpen?: (file: FileItem) => void;
}

export function FileGrid({
  files,
  onDownload,
  onOpen,
}: FileGridProps) {
  return (
    <div
      className="
        grid
        gap-4
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onDownload={onDownload}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}