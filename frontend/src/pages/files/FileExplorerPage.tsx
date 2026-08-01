import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getFolderFiles } from "../../services/file";
import type { FileItem } from "../../types/file";

export default function FileExplorerPage() {
  const { folderId } = useParams();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    loadFiles();
  }, [folderId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Folder #{folderId}
      </h1>

      {files.length === 0 ? (
        <p>No files in this folder.</p>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            className="border rounded-lg p-4 mb-3"
          >
            📄 {file.original_name}
          </div>
        ))
      )}
    </div>
  );
}