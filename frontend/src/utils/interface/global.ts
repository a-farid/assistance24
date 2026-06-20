export interface GetAllDataParams<T> {
      current_page: number;
      total_pages: number;
      total_records: number;
      limit: number;
      data: T[];
    }

export interface GetAllDataResponse<T>   {
    data: {
      current_page: number;
      total_pages: number;
      total_records: number;
      limit: number;
      items: T[];
    };
    error: any;
    isLoading: boolean;
  }


export interface ProtectedProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'worker' | 'client' | Array<'admin' | 'worker' | 'client'>;
  showLoader?: boolean;
}

// 1. Mirror the backend's PaginatedPayload structural schema
export interface PaginatedPayload<T> {
  items: T[] | null; // Ensures arrays map correctly to generic sets
  current_page: number | null;
  total_pages: number | null;
  total_records: number | null;
  limit: number | null;
}

// 2. Mirror the ApiResponseAll schema
export interface I_ApiResponseAll<T> {
  success: boolean;
  data: PaginatedPayload<T>;
}

// 3. Mirror the ApiResponseOne schema
export interface I_ApiResponseOne<T> {
  success: boolean;
  item: T | null;
  status_code: number;
  message: string | null;
}