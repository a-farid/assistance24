import { HeadCell } from "./headers_cells";

export type Order = 'asc' | 'desc';

// Create a function that returns styles based on theme
export const getTableStyles = (isDark: boolean) => ({
  cell: {
    borderBottom: `2px solid ${isDark ? '#404040' : '#e0e0e0'}`,
    borderRight: `2px solid ${isDark ? '#404040' : '#e0e0e0'}`,
    color: isDark ? '#fff' : '#000',
  },
  
  headerCell: {
    borderBottom: `2px solid ${isDark ? '#505050' : '#d0d0d0'}`,
    borderRight: `2px solid ${isDark ? '#404040' : '#e0e0e0'}`,
    backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#000',
  },
  
  sortLabel: {
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#000',

  },
  
  typography: {
    color: isDark ? '#fff' : '#000',
  }
});

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
    }
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export const handleChangeRowsPerPage = (
  event: any,
  setRows: React.Dispatch<React.SetStateAction<number>>,
  setPage: React.Dispatch<React.SetStateAction<number>>
) => {
  const value = parseInt(event.target.value, 10);
  setRows(value);
  setPage(0); // Reset to first page on change
};

export type CustomTableProps<T> = {
  rawData: {
    current_page: number;
    total_pages: number;
    total_records: number;
    limit: number;
    data: T[];
  };
  headCells: readonly HeadCell[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
  onRowClickRoute?: string;
  dataTransformer?: (item: T) => any;
};