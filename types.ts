
export interface Restaurant {
  id: string;
  name: string;
  phone: string;
  address: string;
  cuisine: string;
  mapsUrl: string;
  called: boolean;
  notes: string;
  searchDate: string;
  location: string;
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  results: Restaurant[];
}

export enum CallStatus {
  NOT_CALLED = 'Not Called',
  CALLED = 'Called',
}
