import { useState } from "react";

import type { PreviewFile } from "../types/preview";

export function usePreview() {
  const [selectedFile, setSelectedFile] =
    useState<PreviewFile | null>(null);

  const [isOpen, setIsOpen] =
    useState(false);

  function openPreview(file: PreviewFile) {
    setSelectedFile(file);
    setIsOpen(true);
  }

  function closePreview() {
    setSelectedFile(null);
    setIsOpen(false);
  }

  return {
    selectedFile,
    isOpen,
    openPreview,
    closePreview,
  };
}