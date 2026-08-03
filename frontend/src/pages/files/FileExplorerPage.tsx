import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useUpload } from "@/hooks/useUpload";
import { UploadDropzone } from "@/components/files";

// import { UploadDropzone } from "../../components/files/UploadDropzone";
import { getFolderFiles } from "../../services/file";
import type { FileItem } from "../../types/file";
import {
  EmptyFiles,
  FileGrid,
  FileToolbar,
} from "@/components/files";


export default function FileExplorerPage() {
  const { folderId } = useParams();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { uploading, upload } = useUpload({
  folderId: Number(folderId),
  onSuccess: loadFiles,
  });

  const [gridView, setGridView] =
    useState(true);
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

  useEffect(() => {
    loadFiles();
  }, [folderId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold text-cyan-400 mb-8">
        Folder #{folderId}
      </h1>

      <UploadDropzone
        onFilesSelected={upload}
      />
      <FileToolbar
        search={search}
        onSearchChange={setSearch}
        gridView={gridView}
        onToggleView={() =>
        setGridView((v) => !v)
        }
        onUpload={() => {
          console.log("upload");
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
              console.log(file);
           }}
        />
     )}

      </div>

     
    </div>
  );
}