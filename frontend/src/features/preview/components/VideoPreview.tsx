import type { PreviewFile } from "../types/preview";

interface VideoPreviewProps {
  file: PreviewFile;
}

export function VideoPreview({
  file,
}: VideoPreviewProps) {
  return (
    <div className="p-10">
      Video Preview

      <br />

      {file.original_name}
    </div>
  );
}