import * as React from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TablePagination,
  TableRow, Paper, Switch, FormControlLabel
} from '@mui/material';
import { useTheme } from 'next-themes';
import { CustomTableProps, Order, getComparator, getTableStyles } from './table_utils';
import { EnhancedTableHead } from './table_head';
import { useRouter } from 'next/navigation';



export default function CustomTableComponent<T>(props: CustomTableProps<T>) {
  const { rawData, headCells, onPageChange, onRowsPerPageChange, onRowClickRoute, dataTransformer} = props;
  const { current_page, total_records, limit, data } = rawData;

  const rows = data.map((item) => {
    const transformed = dataTransformer ? dataTransformer(item) : item;
    return {
      ...transformed,
      disabled: typeof transformed.disabled === 'boolean' ? (transformed.disabled ? 'Yes' : 'No') : transformed.disabled,
    };
  });

  const firstKey = rows.length > 0 ? (Object.keys(rows[0])[0] as keyof T) : '' as keyof T;
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T>(firstKey);
  const [dense, setDense] = React.useState(false);

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tableStyles = getTableStyles(isDark);
  const router = useRouter();

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1); // convert to 1-based indexing
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(1); // reset to first page
  };

  const sortedRows = React.useMemo(() => {
    return [...rows].sort(getComparator(order, orderBy));
  }, [rows, order, orderBy]);

  return (
    <Box sx={{ width: '100%' }} className="bg-transparent p-4 rounded-lg shadow-md my-5">
      <Paper sx={{ width: '100%', mb: 2, backgroundColor: "transparent", color: isDark ? "white" : "black" }}>
        <TableContainer sx={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
          <Table sx={{ minWidth: 750 }} size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              tableStyles={tableStyles}
              headCells={headCells}
              numSelected={0}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {sortedRows.map((row: any) => (
                <TableRow
                  hover
                  key={row.id}
                  onClick={() => onRowClickRoute && router.push(`${onRowClickRoute}/${row.id}`)}
                  sx={{ cursor: onRowClickRoute ? 'pointer' : 'default' }}
                >
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align="center"
                      sx={tableStyles.cell}
                    >
                      {row[headCell.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total_records}
          rowsPerPage={limit}
          page={current_page - 1}
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
      </Paper>

      <FormControlLabel
        control={
          <Switch
            checked={dense}
            onChange={(e) => setDense(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: isDark ? '#3b82f6' : '#1976d2',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: isDark ? '#3b82f6' : '#1976d2',
              }
            }}
          />
        }
        label={<span style={{ color: isDark ? '#fff' : '#000' }}>Dense padding</span>}
      />
    </Box>
  );
}
