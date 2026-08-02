import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import FileUpload from "../../components/files/FileUpload";
import { getFolderFiles } from "../../services/file";
import type { FileItem } from "../../types/file";
import FileCard from "@/components/files/Filecard";

export default function FileExplorerPage() {
  const { folderId } = useParams();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

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

      <FileUpload
        folderId={Number(folderId)}
        onUploadSuccess={loadFiles}
      />

      <div className="mt-8">

        {files.length === 0 ? (
          <p className="text-slate-400">
            No files in this folder.
          </p>
        ) : (
          files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
            />
          ))
        )}

      </div>

     
    </div>
  );
}