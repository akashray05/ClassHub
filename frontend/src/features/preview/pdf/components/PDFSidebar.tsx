import { usePDF } from "../hooks/usePDF";

export function PDFSidebar() {

    const {
        state,
    } = usePDF();

    if (!state.sidebarOpen) {
        return null;
    }

    return (
        <div className="w-64 overflow-y-auto border-r border-border bg-background">

            <div className="p-4 text-sm text-muted-foreground">
                Thumbnails
            </div>

            {Array.from(
                {
                    length: state.totalPages || 10,
                },
                (_, index) => (
                    <div
                        key={index}
                        className="m-3 flex h-28 items-center justify-center rounded border border-border hover:border-primary"
                    >
                        {index + 1}
                    </div>
                )
            )}

        </div>
    );
}