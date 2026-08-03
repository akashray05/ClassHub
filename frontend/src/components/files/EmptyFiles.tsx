import { FolderOpen } from "lucide-react";

import { AppButton } from "@/components/app";

interface EmptyFilesProps {
  onUpload?: () => void;
}

export function EmptyFiles({
  onUpload,
}: EmptyFilesProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">

      <FolderOpen
        className="h-20 w-20 text-slate-600"
      />

      <h2 className="mt-6 text-2xl font-semibold text-white">
        This folder is empty
      </h2>

      <p className="mt-2 text-slate-400 text-center max-w-md">
        Upload notes, assignments,
        PDFs or any learning material to
        start organizing this folder.
      </p>

      <AppButton
        className="mt-8"
        onClick={onUpload}
      >
        Upload your first file
      </AppButton>

    </div>
  );
}