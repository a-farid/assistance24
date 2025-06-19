export type Order = 'asc' | 'desc';

export interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
}

export const tableStyles = {
  cell: {
    borderBottom: '1px solid #e0e0e0',
    color: '#000', // Black text for light mode
    '@media (prefers-color-scheme: dark)': {
      color: '#fff', // White text for dark mode
      borderBottom: '1px solid #404040', // Darker border for dark mode
    }
  },
  
  headerCell: {
    borderBottom: '2px solid #d0d0d0',
    fontWeight: 'bold',
    color: '#000', // Black text for light mode
    '@media (prefers-color-scheme: dark)': {
      color: '#fff', // White text for dark mode
      borderBottom: '2px solid #505050', // Darker border for dark mode
    }
  },
  
  sortLabel: {
    color: '#000', // Black text for light mode
    '@media (prefers-color-scheme: dark)': {
      color: '#fff', // White text for dark mode
    }
  },
  
  typography: {
    color: '#000', // Black text for light mode
    '@media (prefers-color-scheme: dark)': {
      color: '#fff', // White text for dark mode
    }
  }
};


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

export const allUsersHeadCells: readonly HeadCell[] = [
  {
    id: 'first_name',
    disablePadding: false,
    label: 'First Name',
  },
  {
    id: 'last_name',
    disablePadding: false,
    label: 'Last Name',
  },
  {
    id: 'username',
    disablePadding: false,
    label: 'Username',
  },
  {
    id: 'email',
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'phone',
    disablePadding: false,
    label: 'Phone',
  },
  {
    id: 'adress',
    disablePadding: false,
    label: 'Address',
  },
  {
    id: 'role',
    disablePadding: false,
    label: 'Role',
  },
  {
    id: 'disabled',
    disablePadding: false,
    label: 'Disabled',
  },
];