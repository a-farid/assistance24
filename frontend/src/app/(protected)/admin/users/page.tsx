'use client';

import React, { useState } from 'react';
import Loading from '@/components/custom/Loading';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useGetUsers } from '@/lib/api/usersApi';
import UsersPagination from './_components/usersPagination';
import UsersGridTable from './_components/UsersGridTable';
import FilterUsersRole from './_components/FilterUsersRole';
import { FilterRoleType } from '@/utils/interface/user_interfaces';


export const UsersGridPage = () => {

  const t = useTranslations('GetAllUsersPage');  
  
  // 💡 1. One-Indexed State Management (Backend Baseline)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(3);
  const [roleFilter, setRoleFilter] = useState<FilterRoleType>('all');
  


  // 2. Fetch data slice reactively based on state mutations
  const { data: responseEnvelope, isLoading, error } = useGetUsers({ 
    page, 
    limit, 
    role: roleFilter === 'all' ? undefined : roleFilter 
  });

  if (isLoading) return <Loading />;
  if (error) return <div className="p-4 text-red-500">Error loading users data grid</div>;

  const usersList = responseEnvelope?.items || [];
  const total_records = responseEnvelope?.total_records || 0;
  const current_page = responseEnvelope?.current_page || 1;

  return (
    <div className="p-6 space-y-6">
      <FilterUsersRole setPage={setPage} setRoleFilter={setRoleFilter} roleFilter={roleFilter}/>
      <UsersGridTable usersList={usersList}/>
      <UsersPagination total_records={total_records} limit={limit} current_page={current_page} setPage={setPage} setLimit={setLimit} />
      <Button variant="contained" disableElevation href="/admin/users/create" className="h-fit">
        {t('addUser')}
      </Button>
    </div>
  );
};

export default UsersGridPage;