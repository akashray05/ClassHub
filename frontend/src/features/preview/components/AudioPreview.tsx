import type { PreviewFile } from "../types/preview";

interface AudioPreviewProps {
  file: PreviewFile;
}

export function AudioPreview({
  file,
}: AudioPreviewProps) {
  return (
    <div className="p-10">
      Audio Preview

      <br />

      {file.original_name}
    </div>
  );
}