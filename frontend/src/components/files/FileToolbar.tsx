import { Search, Upload, Grid3X3, List, ArrowUpDown, Check } from "lucide-react";

import { AppButton } from "@/components/app";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SortBy, SortOrder } from "@/services/file";

interface FileToolbarProps {
  search: string;

  onSearchChange: (value: string) => void;

  gridView: boolean;

  onToggleView: () => void;

  onUpload: () => void;

  sortBy?: SortBy;

  sortOrder?: SortOrder;

  onSortChange?: (sortBy: SortBy, sortOrder: SortOrder) => void;
}

const SORT_OPTIONS: { label: string; sortBy: SortBy; sortOrder: SortOrder }[] = [
  { label: "Newest first", sortBy: "date", sortOrder: "desc" },
  { label: "Oldest first", sortBy: "date", sortOrder: "asc" },
  { label: "Name (A–Z)", sortBy: "name", sortOrder: "asc" },
  { label: "Name (Z–A)", sortBy: "name", sortOrder: "desc" },
  { label: "Largest first", sortBy: "size", sortOrder: "desc" },
  { label: "Smallest first", sortBy: "size", sortOrder: "asc" },
];

export function FileToolbar({
  search,
  onSearchChange,
  gridView,
  onToggleView,
  onUpload,
  sortBy = "date",
  sortOrder = "desc",
  onSortChange,
}: FileToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      {/* Search */}

      <div className="relative w-full md:max-w-md">

        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />

        <input
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="Search files..."
          className="
            w-full
            rounded-xl
            border
            border-border
            bg-card
            py-2
            pl-10
            pr-4
            text-foreground
            outline-none
            focus:border-primary
          "
        />

      </div>

      {/* Actions */}

      <div className="flex gap-2">

        {onSortChange && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <AppButton variant="outline">
                <ArrowUpDown className="h-4 w-4" />
              </AppButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-card border-border text-foreground">
              {SORT_OPTIONS.map((option) => {
                const active =
                  option.sortBy === sortBy && option.sortOrder === sortOrder;

                return (
                  <DropdownMenuItem
                    key={option.label}
                    onClick={() =>
                      onSortChange(option.sortBy, option.sortOrder)
                    }
                  >
                    <span className="flex-1">{option.label}</span>
                    {active && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <AppButton
          variant="outline"
          onClick={onToggleView}
        >
          {gridView ? (
            <List className="h-4 w-4" />
          ) : (
            <Grid3X3 className="h-4 w-4" />
          )}
        </AppButton>

        <AppButton
          onClick={onUpload}
        >
          <Upload className="mr-2 h-4 w-4" />

          Upload
        </AppButton>

      </div>

    </div>
  );
}