import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

import "pdfjs-dist/web/pdf_viewer.css";

pdfjsLib.GlobalWorkerOptions.workerSrc =
    new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
    ).toString();

interface Props {
    url: string;
    token: string;
}

export default function PDFCanvas({
    url,
    token,
}: Props) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        async function render() {

            const loadingTask = pdfjsLib.getDocument({

                url,

                httpHeaders: {
                    Authorization: `Bearer ${token}`,
                },

            });

            const pdf = await loadingTask.promise;

            const page = await pdf.getPage(1);

            const viewport = page.getViewport({
                scale: 1.5,
            });

            const canvas = canvasRef.current!;

            const ctx = canvas.getContext("2d")!;

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
    canvasContext: ctx!,
    viewport,
} as any).promise;

        }

        render();

    }, [url, token]);

    return (

        <div className="flex justify-center p-8">

            <canvas
                ref={canvasRef}
                className="shadow-2xl rounded-lg"
            />

        </div>

    );

} 