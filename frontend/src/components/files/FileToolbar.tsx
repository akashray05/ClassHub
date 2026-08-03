import { Search, Upload, Grid3X3, List } from "lucide-react";

import { AppButton } from "@/components/app";

interface FileToolbarProps {
  search: string;

  onSearchChange: (value: string) => void;

  gridView: boolean;

  onToggleView: () => void;

  onUpload: () => void;
}

export function FileToolbar({
  search,
  onSearchChange,
  gridView,
  onToggleView,
  onUpload,
}: FileToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      {/* Search */}

      <div className="relative w-full md:max-w-md">

        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
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
            border-slate-700
            bg-slate-900
            py-2
            pl-10
            pr-4
            text-white
            outline-none
            focus:border-cyan-500
          "
        />

      </div>

      {/* Actions */}

      <div className="flex gap-2">

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