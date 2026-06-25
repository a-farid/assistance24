'use client';

import { TablePagination } from "@mui/material";
import { useTheme } from 'next-themes';


export default function UsersPagination({total_records, limit, current_page, setPage, setLimit}: any) {
    const { theme } = useTheme();

    const isDark = theme === 'dark';
      // 💡 4. Handle Page Changes: Convert MUI's 0-indexed values back to 1-indexed API coordinates
      const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPageZeroIndexed: number) => {
        const targetPage = newPageZeroIndexed + 1;
        setPage(targetPage);
      };
      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newLimit = parseInt(event.target.value, 10);
        setLimit(newLimit);
        setPage(1); 
      };
    return (
        <>
    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-lg border border-gray-200 dark:border-slate-800 overflow-x-auto">
        <TablePagination
          rowsPerPageOptions={[3, 6, 9, 12, 15]}
          component="div"
          count={total_records}
          rowsPerPage={limit}
          page={current_page - 1} // Maps your 1-indexed backend value down to MUI's 0-indexed view
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            color: isDark ? '#fff' : '#000',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              color: isDark ? '#fff' : '#000',
            },
            '& .MuiSelect-icon': {
              color: isDark ? '#fff' : '#000',
            }
          }}
        />
      </div>
      </>
    );
}