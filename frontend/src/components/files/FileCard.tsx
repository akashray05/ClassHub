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

  selected?: boolean;

  onToggleSelect?: (file: FileItem) => void;
}

export function FileCard({
  file,
  onDownload,
  onOpen,
  onRename,
  onDelete,
  onShare,
  onMove,
  selected = false,
  onToggleSelect,
}: FileCardProps) {
  return (
    <AppCard
      className={`flex cursor-pointer items-center justify-between gap-3 p-4 ${
        selected ? "border-primary ring-1 ring-primary" : ""
      }`}
      onClick={() => {
        onOpen?.(file);
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggleSelect(file)}
            className="h-4 w-4 shrink-0 rounded border-border bg-background accent-primary"
            aria-label={`Select ${file.original_name}`}
          />
        )}

        <div className="flex min-w-0 items-center gap-4">
          <FileTypeIcon
            filename={file.original_name}
            className="h-10 w-10 shrink-0"
          />

          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {file.original_name}
            </h3>

            <p className="text-sm text-muted-foreground">
              {formatBytes(file.file_size)}
            </p>
          </div>
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

