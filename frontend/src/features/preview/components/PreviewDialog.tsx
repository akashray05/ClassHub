import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FilePreview } from "./FilePreview";
import type { PreviewFile } from "../types/preview";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: PreviewFile | null;
}

export function PreviewDialog({
  open,
  onOpenChange,
  file,
}: PreviewDialogProps) {
  if (!file) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh]
    w-[80vw]
    min-w-[800px]
    min-h-[700px]
    max-w-none
    max-h-none
    resize
    overflow-auto
    p-0
    flex
    flex-col
    flex-1
    rounded-lg
    border
    border-border
    bg-background">

        <DialogHeader className="border-b border-border px-6 py-4 shrink-0">
          <DialogTitle className="text-foreground">
            {file.original_name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <FilePreview file={file} />
        </div>

      </DialogContent>
    </Dialog>
  );
}