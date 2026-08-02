import {
  Download,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";

import { Button } from "../ui/button";
import type { FileItem } from "../../types/file";

type Props = {
  file: FileItem;
};

export default function FileCard({ file }: Props) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-cyan-400 transition">

      <div className="flex justify-between items-center">

        <div className="flex gap-4 items-center">

          <div className="rounded-lg bg-cyan-500/10 p-3">

            <FileText
              className="text-cyan-400"
              size={28}
            />

          </div>

          <div>

            <h3 className="text-white font-semibold text-lg">
              {file.original_name}
            </h3>

            <p className="text-slate-400 text-sm">
              {(file.file_size / 1024).toFixed(1)} KB
            </p>

          </div>

        </div>

        <div className="flex gap-2">

          <Button
            size="icon"
            variant="ghost"
          >
            <Download size={18} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
          >
            <Pencil size={18} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
          >
            <Trash2 size={18} />
          </Button>

        </div>

      </div>

    </div>
  );
}