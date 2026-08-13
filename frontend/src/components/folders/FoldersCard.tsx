import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { AppCard } from "../app";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

type Props = {
  id: number;
  name: string;
  description?: string | null;
  onClick?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
};

export default function FolderCard({
  name,
  description,
  onClick,
  onRename,
  onDelete,
}: Props) {
  return (
    <AppCard
      onClick={onClick}
      className="
        cursor-pointer
        rounded-xl
        border
        border-border
        bg-card
        p-5
        hover:border-primary/60
        hover:bg-muted
        transition
        relative
      "
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold">
          📁 {name}
        </h3>

        {(onRename || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="bg-card border-border text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              {onRename && (
                <DropdownMenuItem onClick={onRename}>
                  <Pencil size={16} />
                  Rename
                </DropdownMenuItem>
              )}

              {onDelete && (
                <DropdownMenuItem onClick={onDelete} variant="destructive">
                  <Trash2 size={16} />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {description && (
        <p className="mt-2 text-muted-foreground">
          {description}
        </p>
      )}
    </AppCard>
  );
}
