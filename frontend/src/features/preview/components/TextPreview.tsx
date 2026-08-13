import type { PreviewFile } from "../types/preview";

interface TextPreviewProps {
  file: PreviewFile;
}

export function TextPreview({
  file,
}: TextPreviewProps) {
  return (
    <div className="flex h-full flex-col p-10">
      <h2 className="mb-4 text-xl font-semibold text-foreground">
        Text Preview
      </h2>

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-foreground/80">
          Preview for:
        </p>

        <p className="mt-2 font-mono text-primary">
          {file.original_name}
        </p>

        <div className="mt-6 rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
          Text file rendering will be implemented in the next sprint.
        </div>
      </div>
    </div>
  );
}