import type { UploadItem } from "../types/upload";
import { UploadCard } from "./UploadCard";

interface UploadQueueProps {
    uploads: UploadItem[];
    onRemove: (id: string) => void;
}

export function UploadQueue({
    uploads,
    onRemove,
}: UploadQueueProps) {
    if (uploads.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
                Upload Queue
            </h2>

            {uploads.map((upload) => (
                <UploadCard
                    key={upload.id}
                    upload={upload}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}