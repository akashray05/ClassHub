import { Download } from "lucide-react";

import { formatBytes } from "@/utils";
import { AppButton } from "@/components/app";
import { AppCard } from "@/components/app";
import { FileTypeIcon } from "./FileTypeIcon";

import type { FileItem } from "@/types/file";

interface FileCardProps {
  file: FileItem;

  onDownload?: (file: FileItem) => void;

  onOpen?: (file: FileItem) => void;
}

export function FileCard({
  file,
  onDownload,
  onOpen,
}: FileCardProps) {
  return (
    <AppCard
      className="flex cursor-pointer items-center justify-between p-4"
      onClick={() => {
        console.log("File clicked", file);
        onOpen?.(file);
      }}  
    >
      <div className="flex items-center gap-4">
        <FileTypeIcon
          filename={file.original_name}
          className="h-10 w-10"
        />

        <div>
          <h3 className="font-semibold text-white">
            {file.original_name}
          </h3>

          <p className="text-sm text-slate-400">
            {formatBytes(file.file_size)}
          </p>
        </div>
      </div>

      <AppButton
        size="icon"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          onDownload?.(file);
        }}
      >
        <Download className="h-4 w-4" />
      </AppButton>
    </AppCard>
  );
}