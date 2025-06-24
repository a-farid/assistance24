import * as React from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TablePagination,
  TableRow, Paper, Checkbox, FormControlLabel, Switch
} from '@mui/material';
import { useTheme } from 'next-themes';
import { HeadCell, Order, getTableStyles } from './table_utils';
import { EnhancedTableToolbar } from './table_toolbar';
import { EnhancedTableHead } from './table_head';


type CustomTableProps<T> = {
  rawData: {
    current_page: number;
    total_pages: number;
    total_records: number;
    limit: number;
    data: any[];
  };
  headCells: readonly HeadCell[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
  dataTransformer?: (item: T) => any;
};

export default function CustomTableComponent<T>({
  rawData,
  headCells,
  onPageChange,
  onRowsPerPageChange,
}: CustomTableProps<T>) {

  const { current_page, total_pages, total_records, limit, data } = rawData;

  const paginationMeta = {
  currentPage: current_page,
  totalPages: total_pages,
  totalRecords: total_records,
  limit: limit,
};

const rows = data.map((item) => ({
      ...item,
      disabled: typeof item.disabled === 'boolean' ? (item.disabled ? 'Yes' : 'No') : item.disabled,
    }));



  const firstKey = rows.length > 0 ? (Object.keys(rows[0])[0] as keyof T) : '' as keyof T;
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T>(firstKey);
  const [selected, setSelected] = React.useState<readonly (string | number)[]>([]);
  const [dense, setDense] = React.useState(false);

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tableStyles = getTableStyles(isDark);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n: any) => n.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string | number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly (string | number)[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1); // convert to 1-based indexing
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(1); // reset to first page when limit changes
  };

  return (
    <Box sx={{ width: '100%' }} className="bg-transparent p-4 rounded-lg shadow-md">
      <Paper sx={{ width: '100%', mb: 2, backgroundColor: "transparent", color: isDark ? "white" : "black" }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} />
        <TableContainer sx={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
          <Table
            sx={{ minWidth: 750 }}
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              tableStyles={tableStyles}
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.map((row: any, index) => {
                const isItemSelected = selected.includes(row.id);

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        sx={{ color: isDark ? '#fff' : '#000' }}
                      />
                    </TableCell>
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
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={paginationMeta.totalRecords}
          rowsPerPage={paginationMeta.limit}
          page={paginationMeta.currentPage - 1}
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
