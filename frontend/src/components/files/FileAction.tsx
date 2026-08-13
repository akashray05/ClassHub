import { MoreVertical, Download, Pencil, Trash2, Eye, Share2, FolderInput } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import type { FileItem } from "@/types/file";

interface FileActionProps {
  file: FileItem;

  onOpen?: (file: FileItem) => void;
  onDownload?: (file: FileItem) => void;
  onRename?: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
  onShare?: (file: FileItem) => void;
  onMove?: (file: FileItem) => void;
}

export function FileAction({
  file,
  onOpen,
  onDownload,
  onRename,
  onDelete,
  onShare,
  onMove,
}: FileActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-card border-border text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        {onOpen && (
          <DropdownMenuItem onClick={() => onOpen(file)}>
            <Eye className="h-4 w-4" />
            Preview
          </DropdownMenuItem>
        )}

        {onDownload && (
          <DropdownMenuItem onClick={() => onDownload(file)}>
            <Download className="h-4 w-4" />
            Download
          </DropdownMenuItem>
        )}

        {onRename && (
          <DropdownMenuItem onClick={() => onRename(file)}>
            <Pencil className="h-4 w-4" />
            Rename
          </DropdownMenuItem>
        )}

        {onShare && (
          <DropdownMenuItem onClick={() => onShare(file)}>
            <Share2 className="h-4 w-4" />
            Share
          </DropdownMenuItem>
        )}

        {onMove && (
          <DropdownMenuItem onClick={() => onMove(file)}>
            <FolderInput className="h-4 w-4" />
            Move to folder
          </DropdownMenuItem>
        )}

        {onDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(file)}
            variant="destructive"
          >
            <Trash2 className="h-4 w-4" />
            Move to trash
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
