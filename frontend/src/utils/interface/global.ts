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
      data: T[];
    };
    error: any;
    isLoading: boolean;
  }

export interface ProtectedProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'worker' | 'client' | Array<'admin' | 'worker' | 'client'>;
  showLoader?: boolean;
}