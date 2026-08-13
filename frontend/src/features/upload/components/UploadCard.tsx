import type { UploadItem } from "../types/upload";

interface UploadCardProps {
    upload: UploadItem;
    onRemove: (id: string) => void;
}

function getStatusColor(status: UploadItem["status"]) {
    switch (status) {
        case "queued":
            return "bg-muted-foreground";

        case "uploading":
            return "bg-primary";

        case "success":
            return "bg-green-500";

        case "error":
            return "bg-red-500";

        case "cancelled":
            return "bg-yellow-500";

        default:
            return "bg-muted-foreground";
    }
}

function getStatusText(status: UploadItem["status"]) {
    switch (status) {
        case "queued":
            return "Waiting";

        case "uploading":
            return "Uploading...";

        case "success":
            return "Completed";

        case "error":
            return "Failed";

        case "cancelled":
            return "Cancelled";

        default:
            return status;
    }
}

export function UploadCard({
    upload,
    onRemove,
}: UploadCardProps) {
    return (
        <div
            className="
                rounded-xl
                border
                border-border
                bg-card
                p-4
                shadow-lg
                transition-all
            "
        >
            <div className="flex items-start justify-between">

                <div className="min-w-0 flex-1">

                    <h3 className="truncate font-semibold text-foreground">
                        {upload.file.name}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {(upload.totalBytes / 1024 / 1024).toFixed(2)} MB
                    </p>

                </div>

                <button
                    onClick={() => onRemove(upload.id)}
                    className="
                        rounded-md
                        bg-red-600
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-foreground
                        transition-colors
                        hover:bg-red-700
                    "
                >
                    Remove
                </button>

            </div>

            <div className="mt-5">

                <div className="h-2 overflow-hidden rounded-full bg-muted">

                    <div
                        className={`
                            h-full
                            transition-all
                            duration-300
                            ${getStatusColor(upload.status)}
                        `}
                        style={{
                            width: `${upload.progress}%`,
                        }}
                    />

                </div>

                <div className="mt-3 flex items-center justify-between">

                    <span className="text-sm text-foreground/80">
                        {upload.progress.toFixed(0)}%
                    </span>

                    <span
                        className={`
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-foreground
                            ${getStatusColor(upload.status)}
                        `}
                    >
                        {getStatusText(upload.status)}
                    </span>

                </div>

            </div>

        </div>
    );
}