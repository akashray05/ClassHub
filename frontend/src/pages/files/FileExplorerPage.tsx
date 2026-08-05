import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UploadQueue } from "@/features/upload";
import {
  PreviewDialog,
  usePreview,
} from "@/features/preview";

import { useUpload } from "@/hooks/useUpload";
import { getDownloadUrl } from "@/services/download";

import {
  UploadDropzone,
  EmptyFiles,
  FileGrid,
  FileToolbar,
} from "@/components/files";

import { getFolderFiles } from "@/services/file";
import type { FileItem } from "@/types/file";

export default function FileExplorerPage() {
  const { folderId } = useParams();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gridView, setGridView] = useState(true);

  const {
    selectedFile,
    isOpen,
    openPreview,
    closePreview,
  } = usePreview();

  async function loadFiles() {
    if (!folderId) return;

    try {
      const data = await getFolderFiles(Number(folderId));
      setFiles(data.files);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const {
    upload,
    uploads,
  } = useUpload({
    folderId: Number(folderId),
    onSuccess: loadFiles,
  });

  useEffect(() => {
    loadFiles();
  }, [folderId]);

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-950 p-10 text-white">
        <h1 className="mb-8 text-4xl font-bold text-cyan-400">
          Folder #{folderId}
        </h1>

        <UploadDropzone
          onFilesSelected={upload}
        />
        <UploadQueue
           uploads={uploads}
           onRemove={() => {}}
        />

        <FileToolbar
          search={search}
          onSearchChange={setSearch}
          gridView={gridView}
          onToggleView={() =>
            setGridView((v) => !v)
          }
          onUpload={() => {
            console.log("Upload button clicked");
          }}
        />

        <div className="mt-8">
          {files.length === 0 ? (
            <EmptyFiles
              onUpload={() => {
                console.log("Upload clicked");
              }}
            />
          ) : (
            <FileGrid
              files={files}
              onDownload={(file) => {
                console.log("Download", file);
              }}
              onOpen={(file) => {
                console.log(
                  "Opening preview",
                  file,
                );

                openPreview({
                  id: file.id,
                  original_name:
                    file.original_name,
                  file_size: file.file_size,
                  mime_type: file.mime_type,
                  download_url:
                    getDownloadUrl(file.id),
                });
              }}
            />
          )}
        </div>
      </div>

      <PreviewDialog
  open={isOpen}
  file={selectedFile}
  onOpenChange={(open) => {
    if (!open) {
      closePreview();
    }
  }}
/>
    </>
  );
}