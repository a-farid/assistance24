export type GetAllDataParams<T> = {
      current_page: number;
      total_pages: number;
      total_records: number;
      limit: number;
      data: T[];
    }

export type GetAllDataResponse<T> = {
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