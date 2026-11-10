'use client';

import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from 'pdfjs-dist';

type PdfViewerProps = {
  fileUrl: string;
};

function PdfPage({ document, pageNumber }: { document: PDFDocumentProxy; pageNumber: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let page: PDFPageProxy | null = null;
    let renderTask: RenderTask | null = null;
    let cancelled = false;

    const renderPage = async () => {
      try {
        setIsRendering(true);
        setRenderError(false);
        renderTask?.cancel();

        page = page ?? await document.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(container.clientWidth, 1);
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const displayScale = availableWidth / baseViewport.width;
        const renderViewport = page.getViewport({ scale: displayScale * pixelRatio });

        canvas.width = Math.floor(renderViewport.width);
        canvas.height = Math.floor(renderViewport.height);
        canvas.style.width = `${Math.floor(renderViewport.width / pixelRatio)}px`;
        canvas.style.height = `${Math.floor(renderViewport.height / pixelRatio)}px`;

        const context = canvas.getContext('2d', { alpha: false });
        if (!context) throw new Error('Canvas is unavailable');

        renderTask = page.render({ canvas, canvasContext: context, viewport: renderViewport });
        await renderTask.promise;
        if (!cancelled) setIsRendering(false);
      } catch (error) {
        if (!cancelled && !(error instanceof Error && error.name === 'RenderingCancelledException')) {
          setIsRendering(false);
          setRenderError(true);
        }
      }
    };

    void renderPage();
    const resizeObserver = new ResizeObserver(() => void renderPage());
    resizeObserver.observe(container);

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      renderTask?.cancel();
      page?.cleanup();
    };
  }, [document, pageNumber]);

  return (
    <section aria-label={`Letter page ${pageNumber}`}>
      <div ref={containerRef} className="relative w-full overflow-hidden rounded-lg bg-white shadow-2xl shadow-black/40">
        {isRendering && !renderError && (
          <div className="absolute inset-0 z-10 flex min-h-[55vh] items-center justify-center bg-white text-xs font-bold uppercase tracking-widest text-slate-500">
            Loading page {pageNumber}…
          </div>
        )}
        {renderError && (
          <div className="flex min-h-[40vh] items-center justify-center p-8 text-center text-sm text-slate-600">
            This page could not be displayed. Please refresh and try again.
          </div>
        )}
        <canvas ref={canvasRef} className={`block max-w-full ${renderError ? 'hidden' : ''}`} />
      </div>
      <p className="mt-2 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Page {pageNumber} of {document.numPages}</p>
    </section>
  );
}

export default function PdfViewer({ fileUrl }: PdfViewerProps) {
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let activeDocument: PDFDocumentProxy | null = null;

    const loadDocument = async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const loadingTask = pdfjs.getDocument({ url: fileUrl, useSystemFonts: true });
        activeDocument = await loadingTask.promise;
        if (!cancelled) setDocument(activeDocument);
      } catch {
        if (!cancelled) setError(true);
      }
    };

    void loadDocument();

    return () => {
      cancelled = true;
      activeDocument?.cleanup();
    };
  }, [fileUrl]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center text-sm text-slate-300">
        The official letter could not be displayed. Please refresh the page and try again.
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        Loading official letter…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Array.from({ length: document.numPages }, (_, index) => (
        <PdfPage key={index + 1} document={document} pageNumber={index + 1} />
      ))}
    </div>
  );
}
