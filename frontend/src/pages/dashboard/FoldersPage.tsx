import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CreateFolderDialog from "../../components/folders/CreateFolderDialog";
import RenameFolderDialog from "../../components/folders/RenameFolderDialog";
import DeleteFolderDialog from "../../components/folders/DeleteFolderDialog";
import { getFolders } from "../../services/folder";
import type { Folder } from "../../types/folder";
import FolderCard from "../../components/folders/FoldersCard";
import { FolderGridSkeleton } from "../../components/folders/FolderCardSkeleton";

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [folderToRename, setFolderToRename] = useState<Folder | null>(null);
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  async function loadFolders() {
    try {
      const data = await getFolders();
      setFolders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFolders();
  }, []);

  function openRenameDialog(folder: Folder) {
    setFolderToRename(folder);
    setIsRenameOpen(true);
  }

  function openDeleteDialog(folder: Folder) {
    setFolderToDelete(folder);
    setIsDeleteOpen(true);
  }

  function handleFolderRenamed(updated: Folder) {
    setFolders((prev) =>
      prev.map((folder) => (folder.id === updated.id ? updated : folder))
    );
  }

  function handleFolderDeleted(folderId: number) {
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
  }

  return (
    <div>
      <CreateFolderDialog
        onFolderCreated={loadFolders}
      />

      <h2 className="text-3xl font-bold mb-6">
        My Folders
      </h2>

      {loading ? (
        <FolderGridSkeleton />
      ) : folders.length === 0 ? (
        <p>No folders found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              id={folder.id}
              name={folder.name}
              description={folder.description}
              onClick={() => navigate(`/folders/${folder.id}`)}
              onRename={() => openRenameDialog(folder)}
              onDelete={() => openDeleteDialog(folder)}
            />
          ))}
        </div>
      )}

      <RenameFolderDialog
        folder={folderToRename}
        open={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        onRenamed={handleFolderRenamed}
      />

      <DeleteFolderDialog
        folder={folderToDelete}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDeleted={handleFolderDeleted}
      />
    </div>
  );

}
