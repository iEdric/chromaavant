
export interface ColorData {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  percentage: number;
}

export interface AnalysisResult {
  palette: ColorData[];
  dominantColor: string;
  colorHarmony: string;
  contrastSuggestion: string;
}

export enum AppState {
  IDLE,
  ANALYZING,
  SUCCESS,
  ERROR,
}
