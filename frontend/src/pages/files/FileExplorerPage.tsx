import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { UploadQueue, useUploadManager } from "@/features/upload";
import {
  PreviewDialog,
  usePreview,
} from "@/features/preview";

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
  BulkActionBar,
} from "@/components/files";
import ShareFileDialog from "@/components/shared/ShareFileDialog";

import { getFolderFiles, searchFiles } from "@/services/file";
import type { SortBy, SortOrder } from "@/services/file";
import type { FileItem } from "@/types/file";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileGridSkeleton } from "@/components/files/FileCardSkeleton";

export default function FileExplorerPage() {
  const { folderId } = useParams();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gridView, setGridView] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const PAGE_SIZE = 20;

  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const secondaryFileInputRef = useRef<HTMLInputElement>(null);

  function openSecondaryFilePicker() {
    secondaryFileInputRef.current?.click();
  }

  function handleSecondaryFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!event.target.files || event.target.files.length === 0) return;

    addFiles(Array.from(event.target.files));

    event.target.value = "";
  }

  const [fileToRename, setFileToRename] = useState<FileItem | null>(null);
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const [filesToDelete, setFilesToDelete] = useState<FileItem[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [filesToShare, setFilesToShare] = useState<FileItem[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [filesToMove, setFilesToMove] = useState<FileItem[]>([]);
  const [isMoveOpen, setIsMoveOpen] = useState(false);

  const {
    selectedFile,
    isOpen,
    openPreview,
    closePreview,
  } = usePreview();

  async function loadFiles(targetPage = page) {
    if (!folderId) return;

    try {
      const data = await getFolderFiles(
        Number(folderId),
        targetPage,
        PAGE_SIZE,
        sortBy,
        sortOrder
      );
      setFiles(data.files);
      setTotalPages(data.pages || 1);
      setTotalFiles(data.total ?? data.files.length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const {
    uploads,
    addFiles,
    removeUpload,
  } = useUploadManager({
    folderId: Number(folderId),
    onSuccess: () => loadFiles(page),
  });

  // Reset to page 1 and clear selection whenever the folder changes.
  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [folderId]);

  // Load the current folder page whenever the folder, page, or sort
  // changes, but only while not actively searching (the search effect
  // below takes over in that case).
  useEffect(() => {
    if (!folderId) return;
    if (search.trim()) return;

    loadFiles(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, page, search, sortBy, sortOrder]);

  // Debounced search: resets to page 1 on every new search term.
  useEffect(() => {
    if (!folderId) return;

    const trimmed = search.trim();

    if (!trimmed) return;

    const timeout = setTimeout(async () => {
      try {
        const data = await searchFiles(trimmed, 1, PAGE_SIZE, sortBy, sortOrder);
        setFiles(data.files);
        setTotalPages(data.pages || 1);
        setTotalFiles(data.total ?? data.files.length);
        setPage(1);
      } catch (error) {
        console.error(error);
      }
    }, 350);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, folderId, sortBy, sortOrder]);

  function handleSortChange(nextSortBy: SortBy, nextSortOrder: SortOrder) {
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
    setPage(1);
  }

  async function goToPage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) return;

    const trimmed = search.trim();

    if (trimmed) {
      setPage(nextPage);

      try {
        const data = await searchFiles(
          trimmed,
          nextPage,
          PAGE_SIZE,
          sortBy,
          sortOrder
        );
        setFiles(data.files);
        setTotalPages(data.pages || 1);
        setTotalFiles(data.total ?? data.files.length);
      } catch (error) {
        console.error(error);
      }
    } else {
      setPage(nextPage);
    }
  }

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
    setFilesToDelete([file]);
    setIsDeleteOpen(true);
  }

  function openShareDialog(file: FileItem) {
    setFilesToShare([file]);
    setIsShareOpen(true);
  }

  function openMoveDialog(file: FileItem) {
    setFilesToMove([file]);
    setIsMoveOpen(true);
  }

  function handleFileRenamed(updated: FileItem) {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === updated.id ? { ...file, ...updated } : file
      )
    );
  }

  function clearSelectedIds(ids: number[]) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  }

  function handleFilesDeleted(fileIds: number[]) {
    clearSelectedIds(fileIds);

    const remaining = files.filter((file) => !fileIds.includes(file.id));

    if (remaining.length === 0 && page > 1) {
      goToPage(page - 1);
    } else {
      loadFiles(page);
    }
  }

  function handleFilesMoved(fileIds: number[]) {
    clearSelectedIds(fileIds);

    const remaining = files.filter((file) => !fileIds.includes(file.id));

    if (remaining.length === 0 && page > 1) {
      goToPage(page - 1);
    } else {
      loadFiles(page);
    }
  }

  // Selection

  function toggleSelect(file: FileItem) {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(file.id)) {
        next.delete(file.id);
      } else {
        next.add(file.id);
      }

      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  const selectedFiles = files.filter((file) => selectedIds.has(file.id));

  async function handleBulkDownload() {
    if (selectedFiles.length === 0) return;

    for (const file of selectedFiles) {
      try {
        await downloadFile(file.id, file.original_name);
      } catch (error) {
        console.error(error);
      }
    }

    toast.add({
      title: "Download started",
      description: `Downloading ${selectedFiles.length} file${
        selectedFiles.length > 1 ? "s" : ""
      }.`,
      type: "success",
    });
  }

  function openBulkDeleteDialog() {
    setFilesToDelete(selectedFiles);
    setIsDeleteOpen(true);
  }

  function openBulkMoveDialog() {
    setFilesToMove(selectedFiles);
    setIsMoveOpen(true);
  }

  function openBulkShareDialog() {
    setFilesToShare(selectedFiles);
    setIsShareOpen(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-10 text-foreground">
        <Skeleton className="mb-8 h-9 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="mt-6 flex items-center justify-between gap-3">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-24 shrink-0" />
        </div>
        <div className="mt-8">
          <FileGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background p-10 text-foreground">
        <h1 className="mb-8 text-4xl font-bold text-primary">
          Folder #{folderId}
        </h1>

        <UploadDropzone
          onFilesSelected={(fileList) => addFiles(Array.from(fileList))}
        />
        <UploadQueue
           uploads={uploads}
           onRemove={removeUpload}
        />

        <FileToolbar
          search={search}
          onSearchChange={setSearch}
          gridView={gridView}
          onToggleView={() =>
            setGridView((v) => !v)
          }
          onUpload={openSecondaryFilePicker}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />

        <input
          ref={secondaryFileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleSecondaryFileChange}
        />

        <BulkActionBar
          count={selectedFiles.length}
          onDownload={handleBulkDownload}
          onMove={openBulkMoveDialog}
          onShare={openBulkShareDialog}
          onDelete={openBulkDeleteDialog}
          onClear={clearSelection}
        />

        <div className="mt-8">
          {files.length === 0 ? (
            <EmptyFiles
              onUpload={openSecondaryFilePicker}
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
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
            />
          )}
        </div>

        {files.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
              {totalFiles > 0 && ` · ${totalFiles} files`}
            </span>

            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
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
        files={filesToDelete}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDeleted={handleFilesDeleted}
      />

      <ShareFileDialog
        files={filesToShare}
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        onShared={() => {}}
      />

      <MoveFileDialog
        files={filesToMove}
        open={isMoveOpen}
        onOpenChange={setIsMoveOpen}
        onMoved={handleFilesMoved}
      />
    </>
  );
}
