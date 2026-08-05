export type FitMode = "width" | "page" | "custom";

export interface PDFState {
  currentPage: number;
  totalPages: number;

  zoom: number;
  rotation: number;

  fitMode: FitMode;

  sidebarOpen: boolean;

  fullscreen: boolean;

  searchText: string;

  loading: boolean;
}