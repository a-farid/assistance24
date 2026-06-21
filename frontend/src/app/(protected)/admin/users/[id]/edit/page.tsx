'use client';

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import log from '@/utils/logger';
import Loading from '@/components/custom/Loading';
import TextFieldData from '@/components/shared/TextFieldData';
import Heading from '@/components/custom/Heading';
import { Button } from '@mui/material';
import Image from 'next/image'
import { IUser } from '@/utils/interface/user_interfaces';
import Fab from '@mui/material/Fab';
import { EditIcon } from 'lucide-react';
import BtnWithAction from '@/components/shared/BtnWithAction';
import toast from 'react-hot-toast';

import { useGetUserById } from '@/lib/api/usersApi';

const UserDetails = () => {
    const params = useParams()
    const router = useRouter();
    const userId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    
    if (!userId) {
        log.error("UserDetails", "No userId found in params");
        return <div>Error: User ID not found</div>;
    }
    
    const { data, isLoading, isError, error } = useGetUserById(userId);



    // const { data, isLoading, isError, error } = useGetUserByIdQuery(userId);
    // const [toggleUserStatus, { isLoading: isToggling }] = useToggleUserStatusMutation();

    if (isLoading) { return <Loading />}
    
    if (isError) {
        log.error("UserDetails", "Error fetching user details", error);
        return <div>
            Error: {
                typeof error === 'object' && error !== null && 'message' in error
                    ? (error as { message: string }).message
                    : JSON.stringify(error)
            }
        </div>;
    }

    // Check if data and user data exist
    if (!data?.data) {
        return <div>No user data found</div>;
    }

    // const handleEditProfile = () => {
    //     // Redirect to edit page
    //     window.location.href = `/admin/users/${user.id}/edit`;
    // };


    return (
        <div className="p-4"> User Details Page </div>
    )
}

export default UserDetails