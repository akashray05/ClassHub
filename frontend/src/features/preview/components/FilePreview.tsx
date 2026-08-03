import { getPreviewType } from "../utils/getPreviewType";
import type { PreviewFile } from "../types/preview";

import { PDFPreview } from "./PDFPreview";
import { ImagePreview } from "./ImagePreview";
import { VideoPreview } from "./VideoPreview";
import { AudioPreview } from "./AudioPreview";
import { TextPreview } from "./TextPreview";

interface FilePreviewProps {
  file: PreviewFile;
}

export function FilePreview({
  file,
}: FilePreviewProps) {
  const previewType = getPreviewType(
    file.original_name
  );

  const registry = {
  pdf: <PDFPreview file={file} />,
  image: <ImagePreview file={file} />,
  video: <VideoPreview file={file} />,
  audio: <AudioPreview file={file} />,
  text: <TextPreview file={file} />,

  unknown: (
    <div className="p-10 text-center text-slate-400">
      Preview not available.
    </div>
  ),
};

  return (
    registry[previewType] ?? (
      <div className="p-10 text-center text-slate-400">
        Preview not available.
      </div>
    )
  );
}