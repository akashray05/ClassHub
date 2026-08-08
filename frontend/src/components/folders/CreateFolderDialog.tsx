import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { createFolder } from "../../services/folder";
import { toast } from "../ui/toast";

type Props = {
  onFolderCreated: () => void;
};

export default function CreateFolderDialog({
  onFolderCreated,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      toast.add({
        title: "Folder name required",
        description: "Please enter a name for the folder.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createFolder(name, description);

      setName("");
      setDescription("");

      toast.add({
        title: "Folder created",
        description: `"${name}" was created successfully.`,
        type: "success",
      });

      onFolderCreated();

    } catch (error) {
      console.error(error);

      toast.add({
        title: "Failed to create folder",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
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
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "+ Create Folder"}
      </Button>

    </div>
  );
}