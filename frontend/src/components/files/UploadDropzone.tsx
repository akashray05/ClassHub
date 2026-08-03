import { useRef } from "react";
import { UploadCloud } from "lucide-react";

import { AppButton } from "@/components/app";

interface UploadDropzoneProps {
  onFilesSelected: (files: FileList) => void;
}

export function UploadDropzone({
  onFilesSelected,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!event.target.files) return;

    onFilesSelected(event.target.files);

    event.target.value = "";
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    if (!event.dataTransfer.files.length) return;

    onFilesSelected(event.dataTransfer.files);
  }

  function handleDragOver(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="
        rounded-2xl
        border-2
        border-dashed
        border-cyan-500/40
        bg-slate-900
        p-10
        text-center
        transition-all
        hover:border-cyan-400
      "
    >
      <UploadCloud
        className="mx-auto h-14 w-14 text-cyan-400"
      />

      <h2 className="mt-5 text-xl font-semibold">
        Drag & Drop Files
      </h2>

      <p className="mt-2 text-slate-400">
        or click below to browse files
      </p>

      <AppButton
        className="mt-6"
        onClick={openFilePicker}
      >
        Select Files
      </AppButton>

      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={handleChange}
      />
    </div>
  );
}