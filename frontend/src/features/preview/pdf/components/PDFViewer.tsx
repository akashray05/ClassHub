import { PDFProvider } from "../context/PDFContext";
import { PDFToolbar } from "./PDFToolbar";
// import { PDFCanvas } from "./PDFCanvas";
import { PDFSidebar } from "./PDFSidebar";
import PDFCanvas from "./PDFCanvas";
import type { PreviewFile } from "../../types/preview";
interface PDFViewerProps {
    file: PreviewFile;
}

export function PDFViewer({
    file,
}: PDFViewerProps) {
    const token = localStorage.getItem("access_token") ?? "";
    return (
        <PDFProvider>

            <div className="flex h-full w-full overflow-hidden bg-slate-950">

                <PDFSidebar />

                <div className="flex flex-1 flex-col">

                    <PDFToolbar />

                    <PDFCanvas
    url={file.download_url}
    token={token}
/>

                </div>

            </div>

        </PDFProvider>
    );
}