import { useEffect, useState } from "react";
import type { AxiosError } from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import { renameFolder } from "@/services/folder";
import type { Folder } from "@/types/folder";
import type { MessageResponse } from "@/types/auth";

type Props = {
  folder: Folder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRenamed: (folder: Folder) => void;
};

export default function RenameFolderDialog({
  folder,
  open,
  onOpenChange,
  onRenamed,
}: Props) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (folder) {
      setName(folder.name);
    }
  }, [folder]);

  async function handleRename() {
    if (!folder) {
      return;
    }

    const trimmed = name.trim();

    if (!trimmed) {
      toast.add({
        title: "Folder name required",
        description: "Please enter a name for the folder.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updated = await renameFolder(folder.id, trimmed);

      toast.add({
        title: "Folder renamed",
        description: `Renamed to "${updated.name}".`,
        type: "success",
      });

      onRenamed(updated);
      onOpenChange(false);
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Rename failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not rename the folder.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename folder</DialogTitle>
          <DialogDescription>
            Choose a new name for this folder.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Folder name</Label>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleRename();
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button onClick={handleRename} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
