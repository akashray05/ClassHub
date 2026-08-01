import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateFolderDialog from "../../components/folders/CreateFolderDialog";
import { getFolders } from "../../services/folder";
import type { Folder } from "../../types/folder";
import FolderCard from "../../components/folders/FoldersCard";

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const navigate = useNavigate();
  async function loadFolders() {
    try {
      const data = await getFolders();
      setFolders(data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    loadFolders();
  }, []);
  return (
    <div>
      <CreateFolderDialog
        onFolderCreated={loadFolders}
      />

      <h2 className="text-3xl font-bold mb-6">
        My Folders
      </h2>

      {folders.length === 0 ? (
        <p>No folders found.</p>
      ) : (
        folders.map((folder) => (
          <FolderCard
            key={folder.id}
            id={folder.id}
            name={folder.name}
            description={folder.description}
            onClick={() => navigate(`/folders/${folder.id}`)}
          />
        ))
      )}
    </div>
  );

}