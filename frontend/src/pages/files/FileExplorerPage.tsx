import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UploadQueue } from "@/features/upload";
import {
  PreviewDialog,
  usePreview,
} from "@/features/preview";

import { useUpload } from "@/hooks/useUpload";
import { downloadFile } from "@/services/file";
import { getDownloadUrl } from "@/services/download";

import {
  UploadDropzone,
  EmptyFiles,
  FileGrid,
  FileToolbar,
  RenameFileDialog,
  DeleteFileDialog,
  MoveFileDialog,
} from "@/components/files";
import ShareFileDialog from "@/components/shared/ShareFileDialog";

import { getFolderFiles, searchFiles } from "@/services/file";
import type { FileItem } from "@/types/file";
import { toast } from "@/components/ui/toast";

export default function FileExplorerPage() {
  const { folderId } = useParams();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gridView, setGridView] = useState(true);

  const [fileToRename, setFileToRename] = useState<FileItem | null>(null);
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [fileToShare, setFileToShare] = useState<FileItem | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [fileToMove, setFileToMove] = useState<FileItem | null>(null);
  const [isMoveOpen, setIsMoveOpen] = useState(false);

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

  // Debounced search: falls back to folder listing when cleared.
  useEffect(() => {
    if (!folderId) return;

    const trimmed = search.trim();

    if (!trimmed) {
      loadFiles();
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const data = await searchFiles(trimmed);
        setFiles(data.files);
      } catch (error) {
        console.error(error);
      }
    }, 350);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, folderId]);

  async function handleDownload(file: FileItem) {
    try {
      await downloadFile(file.id, file.original_name);
    } catch (error) {
      console.error(error);

      toast.add({
        title: "Download failed",
        description: "Could not download this file.",
        type: "error",
      });
    }
  }

  function openRenameDialog(file: FileItem) {
    setFileToRename(file);
    setIsRenameOpen(true);
  }

  function openDeleteDialog(file: FileItem) {
    setFileToDelete(file);
    setIsDeleteOpen(true);
  }

  function openShareDialog(file: FileItem) {
    setFileToShare(file);
    setIsShareOpen(true);
  }

  function openMoveDialog(file: FileItem) {
    setFileToMove(file);
    setIsMoveOpen(true);
  }

  function handleFileRenamed(updated: FileItem) {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === updated.id ? { ...file, ...updated } : file
      )
    );
  }

  function handleFileDeleted(fileId: number) {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  }

  function handleFileMoved(fileId: number) {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  }

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
          onUpload={() => {}}
        />

        <div className="mt-8">
          {files.length === 0 ? (
            <EmptyFiles
              onUpload={() => {}}
            />
          ) : (
            <FileGrid
              files={files}
              onDownload={handleDownload}
              onOpen={(file) => {
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
              onRename={openRenameDialog}
              onDelete={openDeleteDialog}
              onShare={openShareDialog}
              onMove={openMoveDialog}
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

      <RenameFileDialog
        file={fileToRename}
        open={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        onRenamed={handleFileRenamed}
      />

      <DeleteFileDialog
        file={fileToDelete}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDeleted={handleFileDeleted}
      />

      <ShareFileDialog
        file={fileToShare}
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        onShared={() => {}}
      />

      <MoveFileDialog
        file={fileToMove}
        open={isMoveOpen}
        onOpenChange={setIsMoveOpen}
        onMoved={handleFileMoved}
      />
    </>
  );
}
