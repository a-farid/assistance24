import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { UserRoundX, ListFilter } from 'lucide-react';
import IconButton from '@mui/material/IconButton';

export function EnhancedTableToolbar(props: {numSelected: number,selected: any }) {
  const { numSelected, selected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
          className="text-black dark:text-white"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
          className="text-black dark:text-white"
        >
          No users Selected
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Deactivate selected users" onClick={() => console.log('Deactivate users', selected)}>
          <IconButton>
            <UserRoundX />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <ListFilter />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}