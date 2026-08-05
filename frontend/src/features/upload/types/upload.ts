export type UploadStatus =
    | "queued"
    | "uploading"
    | "success"
    | "error"
    | "cancelled";

export interface UploadItem {
    id: string;

    file: File;

    progress: number;

    speed: number;

    eta: number;

    uploadedBytes: number;

    totalBytes: number;

    status: UploadStatus;

    error?: string;
}