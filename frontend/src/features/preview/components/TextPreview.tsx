import type { PreviewFile } from "../types/preview";

interface TextPreviewProps {
  file: PreviewFile;
}

export function TextPreview({
  file,
}: TextPreviewProps) {
  return (
    <div className="flex h-full flex-col p-10">
      <h2 className="mb-4 text-xl font-semibold text-white">
        Text Preview
      </h2>

      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
        <p className="text-slate-300">
          Preview for:
        </p>

        <p className="mt-2 font-mono text-cyan-400">
          {file.original_name}
        </p>

        <div className="mt-6 rounded-lg border border-dashed border-slate-700 p-6 text-center text-slate-500">
          Text file rendering will be implemented in the next sprint.
        </div>
      </div>
    </div>
  );
}