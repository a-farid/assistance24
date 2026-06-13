'use client';
import React from 'react';
import Loading from '@/components/custom/Loading';
import { useGetClientsQuery } from '@/lib/features/clients/clientsApi';
import CustomTableComponent from '@/components/custom/table/table';
import { GetAllDataResponse } from '@/lib/interfaces/get_all_data';
import { IUser } from '@/utils/interface/user_interfaces';
import { allUsersHeadCells } from '@/components/custom/table/headers_cells';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';

const ClientsPage = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const t = useTranslations('GetAllClientsPage');

  const { data, error, isLoading } = useGetClientsQuery({ page, limit }) as any
  console.log("data in clients", data);
  if (isLoading) return <Loading />;
  if (error) return <div className="p-4 text-red-600">Error loading clients: {error?.message || 'Unknown error'}</div>;


  const clientsDataUsers = { ...data, data: data?.data.map((client: any) => { return client.user }) };
  console.log("clientsDataUsers", clientsDataUsers);

  return (
    <div>
      <h2 className='pl-3'>{t('title')}</h2>
      <CustomTableComponent
        rawData={clientsDataUsers}
        headCells={allUsersHeadCells}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newLimit) => setLimit(newLimit)}
        onRowClickRoute="/admin/users/"
      />
      <div className='flex justify-end mt-4'>
        <Button className='ml-auto' variant="contained" disableElevation href="/admin/users/create?role=client">
          {t('addClient')}
        </Button>
      </div>
    </div>
  );
};

export default ClientsPage;