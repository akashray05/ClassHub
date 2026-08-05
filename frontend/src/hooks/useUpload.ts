import { useState } from "react";

import { uploadFile } from "@/services/file";

import type {
    UploadItem,
} from "@/features/upload/types/upload";
interface UseUploadProps {
    folderId: number;

    onSuccess?: () => void;
}

export function useUpload({
    folderId,
    onSuccess,
}: UseUploadProps) {
    const [uploading, setUploading] = useState(false);

    const [uploads, setUploads] =
        useState<UploadItem[]>([]);

    async function upload(files: FileList) {
        if (!files.length) return;

        setUploading(true);

        const queue: UploadItem[] = Array.from(files).map((file) => ({
    id: crypto.randomUUID(),

    file,

    progress: 0,

    speed: 0,

    eta: 0,

    uploadedBytes: 0,

    totalBytes: file.size,

    status: "queued",

    error: undefined,
}));

        setUploads(queue);

        try {
            for (const item of queue) {
                setUploads((prev) =>
                    prev.map((u) =>
                        u.id === item.id
                            ? {
                                  ...u,
                                  status: "uploading",
                              }
                            : u
                    )
                );

                await uploadFile(
                    folderId,
                    item.file,
                    (progress) => {
                        setUploads((prev) =>
                            prev.map((u) =>
                                u.id === item.id
                                    ? {
                                          ...u,
                                          progress,
                                      }
                                    : u
                            )
                        );
                    }
                );

                setUploads((prev) =>
                    prev.map((u) =>
                        u.id === item.id
                            ? {
                                  ...u,
                                  progress: 100,
                                  status: "success",
                              }
                            : u
                    )
                );
            }

            onSuccess?.();
        } catch (error) {
            console.error(error);

            setUploads((prev) =>
                prev.map((u) =>
                    u.status === "uploading"
                        ? {
                              ...u,
                              status: "error",
                          }
                        : u
                )
            );
        } finally {
            setUploading(false);
        }
    }

    return {
        uploading,

        uploads,

        upload,
    };
}