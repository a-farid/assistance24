'use client';

import React, { useState } from 'react';
import { IUser } from '@/utils/interface/user_interfaces';
import { Checkbox } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useToggleUserStatus } from '@/lib/api/usersApi';
import { useRouter } from 'next/navigation';
import log from '@/utils/logger';
import UserImage from '@/app/(auth)/_components/UserPhoto';
import BtnWithAction from '@/components/shared/BtnWithAction';
import toast from 'react-hot-toast';
import { ReceiptText, RefreshCcw, ShieldUser, ShieldX, SquarePen, Trash } from 'lucide-react';


export default function UsersGridTable({usersList}: any) {
  const router = useRouter();

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const t = useTranslations('GetAllUsersPage');  

  const { mutate: toggleUserStatus, isPending: isToggling } = useToggleUserStatus();


  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(usersList.map((user: any) => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  // 💡 3. Defensive Destructuring: Guard against undefined records on initial render cycles
  const handleToggleUserStatus = async (user: IUser) => {
    // Trigger the mutation via TanStack Query
    toggleUserStatus(user.id, {
      onSuccess: () => {
        // The backend has processed the change, and our query cache has been invalidated.
        // The data table will automatically animate into its fresh state here.
        const actionLabel = user.disabled ? 'enabled' : 'disabled';
        toast.success(`User registry successfully ${actionLabel}!`);
      },
      onError: (error) => {
        log.error("UserDetails", `Failed to mutate configuration for user [${user.id}]`, error);
        toast.error('Failed to update the target user status registry configuration.');
      }
    });
  };


  return (
    <div className="p-6 space-y-6">
      {/* 💡 High-Density Table Layout Mapping Pattern */}
      <div className="bg-white dark:bg-slate-900 shadow-sm rounded-lg border border-gray-200 dark:border-slate-800 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              <th className="p-4 w-12">
                <Checkbox
                  size="small"
                  checked={usersList.length > 0 && selectedUserIds.length === usersList.length}
                  indeterminate={selectedUserIds.length > 0 && selectedUserIds.length < usersList.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 text-center">Username</th>
              <th className="p-4 text-center">Name</th>
              <th className="p-4 text-center">Email</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-800 text-sm text-gray-700 dark:text-gray-200">
            {usersList?.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">No data models matching records found.</td>
              </tr>
            ) : (
              usersList?.map((user: any) => (
                <tr 
                  key={user.id} 
                  className={`hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                    selectedUserIds.includes(user.id) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}
                >
                  {/* Select Checkbox Node */}
                  <td className="p-4">
                    <Checkbox
                      size="small"
                      checked={selectedUserIds.includes(user.id)}
                    />
                  </td>

                  {/* Username Entity with Profile Context Row */}
                  <td className="p-4 font-medium text-blue-600 dark:text-blue-400">
                    <div className="flex items-center space-x-3">
                      <UserImage userImg={user} widthHeight={40}
                      />
                      <span className="cursor-pointer hover:underline" onClick={() => router.push(`/admin/users/${user.id}`)}>
                        {user.username}
                      </span>
                    </div>
                  </td>

                  {/* Full Name Node */}
                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    {user ? `${user.first_name} ${user.last_name || ''}` : '—'}
                  </td>

                  {/* Email Node */}
                  <td className="p-4 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    {user.email}
                  </td>

                  {/* System Authorization Role Badge */}
                  <td className="p-4 capitalize text-gray-600 dark:text-gray-300">
                    {user.role}
                  </td>

                  {/* State Clearance Status Tag */}
                  <td className="p-4">
                    <span className={`inline-flex items-center justify-center gap-2 px-2 py-0.5 rounded text-xs font-medium w-full ${
                      !user.disabled 
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                      }`}>
                      {!user.disabled ? <><ShieldUser />Active</> : <><ShieldX />Inactive</> }
                      <BtnWithAction
                        title={user.disabled ? "Enable" : "Disable"}
                        message={
                            user.disabled 
                            ? `Are you sure you want to enable ${user.first_name} ${user.last_name}'s profile?`
                            : `Are you sure you want to disable ${user.first_name} ${user.last_name}'s profile?`
                        }
                        confirmText={user.disabled ? "Yes, Enable" : "Yes, Disable"}
                        cancelText="Cancel"
                        onConfirm={()=>handleToggleUserStatus(user)}
                        disabled={isToggling}
                      >
                        <button 
                          disabled={isToggling}
                          className={`${user.disabled ? 'text-emerald-600 hover:text-emerald-800' : 'text-rose-600 hover:text-rose-800'} hover:underline cursor-pointer`}
                        >
                          <RefreshCcw />
                        </button>   
                      </BtnWithAction>
                    </span>

                  </td>

                  {/* Administrative Action Command Toolbar */}
                  <td className="p-4 text-right font-medium space-x-1 text-xs flex items-center justify-center h-20">
                    <button 
                      onClick={() => router.push(`/admin/users/${user.id}/edit`)} 
                      className="text-blue-600 hover:text-blue-800 cursor-pointer px-1"
                    >
                      <SquarePen />
                    </button>
                    <span className="text-gray-300">|</span>
                    <button 
                      onClick={() => router.push(`/admin/users/${user.id}/contracts`)}
                      className="text-blue-600 hover:text-blue-800 hover:underline px-1"
                    >
                      <ReceiptText />
                    </button>
                    <span className="text-gray-300">|</span>
                    <button 
                      onClick={() => router.push(`/admin/users/${user.id}/contracts`)}
                      className="text-rose-600 hover:text-rose-800 hover:underline px-1"
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};