export interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
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