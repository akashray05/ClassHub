import type { PreviewFile } from "../types/preview";

interface ImagePreviewProps {
  file: PreviewFile;
}

export function ImagePreview({
  file,
}: ImagePreviewProps) {
  return (
    <div className="p-10">
      Image Preview

      <br />

      {file.original_name}
    </div>
  );
}