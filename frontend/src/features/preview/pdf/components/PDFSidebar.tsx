import { usePDF } from "../hooks/usePDF";

export function PDFSidebar() {

    const {
        state,
    } = usePDF();

    if (!state.sidebarOpen) {
        return null;
    }

    return (
        <div className="w-64 overflow-y-auto border-r border-slate-800 bg-slate-950">

            <div className="p-4 text-sm text-slate-400">
                Thumbnails
            </div>

            {Array.from(
                {
                    length: state.totalPages || 10,
                },
                (_, index) => (
                    <div
                        key={index}
                        className="m-3 flex h-28 items-center justify-center rounded border border-slate-700 hover:border-cyan-500"
                    >
                        {index + 1}
                    </div>
                )
            )}

        </div>
    );
}