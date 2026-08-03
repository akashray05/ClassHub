import type { PreviewFile } from "../types/preview";

interface PDFPreviewProps {
  file: PreviewFile;
}

export function PDFPreview({
  file,
}: PDFPreviewProps) {
  return (
    <div className="p-10">
      PDF Preview

      <br />

      {file.original_name}
    </div>
  );
}