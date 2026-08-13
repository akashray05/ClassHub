import {
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    Search,
    Sidebar,
    Maximize,
    RotateCw,
    Download,
} from "lucide-react";

import { usePDF } from "../hooks/usePDF";

export function PDFToolbar() {
    const {
        state,
        zoomIn,
        zoomOut,
        setCurrentPage,
        toggleSidebar,
    } = usePDF();

    return (
        <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">

            <button
                onClick={toggleSidebar}
                className="rounded p-2 hover:bg-muted"
            >
                <Sidebar size={18} />
            </button>

            <div className="h-6 w-px bg-muted" />

            <button
                disabled={state.currentPage === 1}
                onClick={() =>
                    setCurrentPage(state.currentPage - 1)
                }
                className="rounded p-2 hover:bg-muted disabled:opacity-30"
            >
                <ChevronLeft size={18} />
            </button>

            <span className="text-sm">
                {state.currentPage} / {state.totalPages}
            </span>

            <button
                disabled={state.currentPage >= state.totalPages}
                onClick={() =>
                    setCurrentPage(state.currentPage + 1)
                }
                className="rounded p-2 hover:bg-muted disabled:opacity-30"
            >
                <ChevronRight size={18} />
            </button>

            <div className="h-6 w-px bg-muted" />

            <button
                onClick={zoomOut}
                className="rounded p-2 hover:bg-muted"
            >
                <Minus size={18} />
            </button>

            <span className="w-14 text-center text-sm">
                {(state.zoom * 100).toFixed(0)}%
            </span>

            <button
                onClick={zoomIn}
                className="rounded p-2 hover:bg-muted"
            >
                <Plus size={18} />
            </button>

            <div className="flex-1" />

            <button className="rounded p-2 hover:bg-muted">
                <Search size={18} />
            </button>

            <button className="rounded p-2 hover:bg-muted">
                <RotateCw size={18} />
            </button>

            <button className="rounded p-2 hover:bg-muted">
                <Download size={18} />
            </button>

            <button className="rounded p-2 hover:bg-muted">
                <Maximize size={18} />
            </button>

        </div>
    );
}