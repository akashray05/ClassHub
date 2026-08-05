import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

import type { PDFState } from "../types";

interface PDFContextValue {
  state: PDFState;

  setCurrentPage: (page: number) => void;

  setTotalPages: (pages: number) => void;

  setZoom: (zoom: number) => void;

  zoomIn: () => void;

  zoomOut: () => void;

  toggleSidebar: () => void;

  setSearchText: (text: string) => void;
}

const PDFContext = createContext<PDFContextValue | null>(null);

export function PDFProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<PDFState>({
    currentPage: 1,
    totalPages: 0,

    zoom: 1,

    rotation: 0,

    fitMode: "width",

    sidebarOpen: true,

    fullscreen: false,

    searchText: "",

    loading: true,
  });

  const value = useMemo(
    () => ({
      state,

      setCurrentPage(page: number) {
        setState((s) => ({
          ...s,
          currentPage: page,
        }));
      },

      setTotalPages(pages: number) {
        setState((s) => ({
          ...s,
          totalPages: pages,
          loading: false,
        }));
      },

      setZoom(zoom: number) {
        setState((s) => ({
          ...s,
          zoom,
          fitMode: "custom",
        }));
      },

      zoomIn() {
        setState((s) => ({
          ...s,
          zoom: Math.min(s.zoom + 0.1, 5),
          fitMode: "custom",
        }));
      },

      zoomOut() {
        setState((s) => ({
          ...s,
          zoom: Math.max(s.zoom - 0.1, 0.3),
          fitMode: "custom",
        }));
      },

      toggleSidebar() {
        setState((s) => ({
          ...s,
          sidebarOpen: !s.sidebarOpen,
        }));
      },

      setSearchText(text: string) {
        setState((s) => ({
          ...s,
          searchText: text,
        }));
      },
    }),
    [state],
  );

  return (
    <PDFContext.Provider value={value}>
      {children}
    </PDFContext.Provider>
  );
}

export function usePDFContext() {
  const context = useContext(PDFContext);

  if (!context) {
    throw new Error(
      "usePDFContext must be used inside PDFProvider",
    );
  }

  return context;
}