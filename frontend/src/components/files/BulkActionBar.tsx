import { Download, FolderInput, Share2, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BulkActionBarProps {
  count: number;
  onDownload: () => void;
  onMove: () => void;
  onShare: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export function BulkActionBar({
  count,
  onDownload,
  onMove,
  onShare,
  onDelete,
  onClear,
}: BulkActionBarProps) {
  if (count === 0) {
    return null;
  }

  return (
    <div
      className="
        sticky top-4 z-10 mb-6 flex flex-wrap items-center gap-3
        rounded-xl border border-border bg-card px-4 py-3 shadow-md
      "
    >
      <span className="text-sm font-medium text-foreground">
        {count} selected
      </span>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Download
        </Button>

        <Button variant="outline" size="sm" onClick={onMove}>
          <FolderInput className="mr-1.5 h-3.5 w-3.5" />
          Move
        </Button>

        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="mr-1.5 h-3.5 w-3.5" />
          Share
        </Button>

        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Delete
        </Button>

        <Button variant="ghost" size="icon-sm" onClick={onClear} aria-label="Clear selection">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
