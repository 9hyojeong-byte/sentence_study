
export interface EnglishEntry {
  date: string; // YYYY-MM-DD
  sentence: string;
  meaning: string;
  hint: string;
  referenceUrl: string;
  check?: boolean;
  bookmark?: boolean; // New bookmark status
  createdAt?: string;
}

export interface AppState {
  entries: EnglishEntry[];
  loading: boolean;
  error: string | null;
}
