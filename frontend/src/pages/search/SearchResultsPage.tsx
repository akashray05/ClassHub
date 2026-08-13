import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";

import { searchFiles, downloadFile } from "@/services/file";
import type { FileItem } from "@/types/file";
import { toast } from "@/components/ui/toast";

import { FileGrid } from "@/components/files";
import { FileGridSkeleton } from "@/components/files/FileCardSkeleton";
import {
  PreviewDialog,
  usePreview,
} from "@/features/preview";
import { getDownloadUrl } from "@/services/download";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { selectedFile, isOpen, openPreview, closePreview } = usePreview();

  useEffect(() => {
    if (!query.trim()) {
      setFiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    searchFiles(query)
      .then((data) => setFiles(data.files))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [query]);

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

  return (
    <>
      <div className="min-h-screen bg-background p-10 text-foreground">
        <div className="flex items-center gap-3 mb-2">
          <SearchIcon className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-primary">
            Search results
          </h1>
        </div>

        <p className="mb-8 text-muted-foreground">
          {query ? (
            <>
              Showing results for <span className="font-medium text-foreground">"{query}"</span>
            </>
          ) : (
            "Enter a search term to find files across all your folders."
          )}
        </p>

        {loading ? (
          <FileGridSkeleton />
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <SearchIcon className="h-20 w-20 text-muted-foreground/60" />

            <h2 className="mt-6 text-2xl font-semibold text-foreground">
              No files found
            </h2>

            <p className="mt-2 max-w-md text-center text-muted-foreground">
              {query
                ? `Nothing matched "${query}". Try a different search term.`
                : "Type something in the search bar above to get started."}
            </p>
          </div>
        ) : (
          <FileGrid
            files={files}
            onDownload={handleDownload}
            onOpen={(file) => {
              openPreview({
                id: file.id,
                original_name: file.original_name,
                file_size: file.file_size,
                mime_type: file.mime_type,
                download_url: getDownloadUrl(file.id),
              });
            }}
          />
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
    </>
  );
}
