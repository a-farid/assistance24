'use client';
import React from 'react';
import Loading from '@/components/custom/Loading';
import { useGetUsersQuery } from '@/lib/features/users/usersApi';
import CustomTableComponent from '@/components/custom/table/table';
import { GetAllDataResponse } from '@/lib/interfaces/get_all_data';
import { IUser } from '@/utils/interface/user_interfaces';
import { allUsersHeadCells } from '@/components/custom/table/headers_cells';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';

const UsersPage = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const t = useTranslations('GetAllUsersPage')

  const { data, error, isLoading } = useGetUsersQuery({ page, limit }) as GetAllDataResponse<IUser[]>;

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading users</div>;
  return (
    <div>
      <h2 className='pl-3'>{t('title')}</h2>
      <CustomTableComponent
        rawData={data}
        headCells={allUsersHeadCells}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newLimit) => setLimit(newLimit)}
        onRowClickRoute="/admin/users/"
        />
      <div className='flex justify-end mt-4'>
        <Button className='ml-auto' variant="contained" disableElevation href="/admin/users/create">
          {t('addUser')}
        </Button>
      </div>
      </div>
  );
};

export default UsersPage;
