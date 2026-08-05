import { UploadCard } from "./UploadCard";
import { useUploadManager } from "../hooks/useUploadManager";

export function UploadManager() {
    const {
    uploads,
    addFiles,
    removeUpload,
} = useUploadManager();

    function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>
) {
    const files = event.target.files;

    if (!files) return;

    addFiles(Array.from(files));
}

    return (
        <div className="space-y-6">

            <div>

                <input
                    type="file"
                    multiple
                    onChange={handleFiles}
                    className="block w-full rounded-lg border border-slate-700 bg-slate-900 p-4 text-white"
                />

            </div>

            <div className="space-y-4">

                {uploads.map((upload) => (
                    <UploadCard
                        key={upload.id}
                        upload={upload}
                        onRemove={removeUpload}
                    />
                ))}

            </div>

        </div>
    );
}