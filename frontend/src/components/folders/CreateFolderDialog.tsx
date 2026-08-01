import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { createFolder } from "../../services/folder";

type Props = {
  onFolderCreated: () => void;
};

export default function CreateFolderDialog({
  onFolderCreated,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreate() {
    if (!name.trim()) {
      alert("Folder name is required");
      return;
    }

    try {
      await createFolder(name, description);

      setName("");
      setDescription("");

      onFolderCreated();

    } catch (error) {
      console.error(error);
      alert("Failed to create folder");
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 mb-6">

      <h2 className="text-xl font-semibold mb-4">
        Create Folder
      </h2>

      <Input
        placeholder="Folder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        className="mt-3"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button
        className="mt-4"
        onClick={handleCreate}
      >
        + Create Folder
      </Button>

    </div>
  );
}