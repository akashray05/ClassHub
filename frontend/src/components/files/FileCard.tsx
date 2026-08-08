import { formatBytes } from "@/utils";
import { AppCard } from "@/components/app";
import { FileTypeIcon } from "./FileTypeIcon";
import { FileAction } from "./FileAction";

import type { FileItem } from "@/types/file";

interface FileCardProps {
  file: FileItem;

  onDownload?: (file: FileItem) => void;

  onOpen?: (file: FileItem) => void;

  onRename?: (file: FileItem) => void;

  onDelete?: (file: FileItem) => void;

  onShare?: (file: FileItem) => void;

  onMove?: (file: FileItem) => void;
}

export function FileCard({
  file,
  onDownload,
  onOpen,
  onRename,
  onDelete,
  onShare,
  onMove,
}: FileCardProps) {
  return (
    <AppCard
      className="flex cursor-pointer items-center justify-between p-4"
      onClick={() => {
        onOpen?.(file);
      }}
    >
      <div className="flex items-center gap-4 min-w-0">
        <FileTypeIcon
          filename={file.original_name}
          className="h-10 w-10 shrink-0"
        />

        <div className="min-w-0">
          <h3 className="font-semibold text-white truncate">
            {file.original_name}
          </h3>

          <p className="text-sm text-slate-400">
            {formatBytes(file.file_size)}
          </p>
        </div>
      </div>

      <FileAction
        file={file}
        onDownload={onDownload}
        onRename={onRename}
        onDelete={onDelete}
        onShare={onShare}
        onMove={onMove}
      />
    </AppCard>
  );
}
