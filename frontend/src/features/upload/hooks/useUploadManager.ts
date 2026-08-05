import { useState } from "react";

import type { UploadItem } from "../types/upload";

export function useUploadManager() {
    const [uploads, setUploads] = useState<UploadItem[]>([]);

    function addFiles(files: File[]) {
        const items: UploadItem[] = files.map((file) => ({
            id: crypto.randomUUID(),

            file,

            progress: 0,

            speed: 0,

            eta: 0,

            uploadedBytes: 0,

            totalBytes: file.size,

            status: "queued",
        }));

        setUploads((prev) => [...prev, ...items]);
    }

    function removeUpload(id: string) {
        setUploads((prev) =>
            prev.filter((item) => item.id !== id),
        );
    }

    function clearCompleted() {
        setUploads((prev) =>
            prev.filter((u) => u.status !== "success"),
        );
    }

    return {
        uploads,

        addFiles,

        removeUpload,

        clearCompleted,

        setUploads,
    };
}