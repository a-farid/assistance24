'use client';

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import log from '@/utils/logger';
import Loading from '@/components/custom/Loading';
import TextFieldData from '@/components/shared/TextFieldData';
import Heading from '@/components/custom/Heading';
import { Button } from '@mui/material';
import { IUser } from '@/utils/interface/user_interfaces';
import BtnWithAction from '@/components/shared/BtnWithAction';
import toast from 'react-hot-toast';
import { useGetUserById, useToggleUserStatus } from '@/lib/api/usersApi';
import UserImage from '@/app/(auth)/_components/UserPhoto';

const UserDetails = () => {
    const params = useParams()
    const router = useRouter();
    const userId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    
    if (!userId) {
        log.error("UserDetails", "No userId found in params");
        return <div>Error: User ID not found</div>;
    }
    
    const { data, isLoading, isError, error } = useGetUserById(userId);
    const { mutate: toggleUserStatus, isPending: isToggling } = useToggleUserStatus();



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

    // ✅ Use data.data directly - don't create a separate variable
    const user: IUser = data.data;

    const handleEditProfile = () => {
        // Redirect to edit page
        window.location.href = `/admin/users/${user.id}/edit`;
    };

    const handleToggleUserStatus = () => {
        // Execute the mutation payload down through the network gateway
        log.info("UserDetails", `Toggling user status for userId: ${user.id}, current status: ${user.disabled ? "Disabled" : "Enabled"}`);
        toggleUserStatus(user.id, {
            onSuccess: () => {
                const actionPerformed = user.disabled ? 'enabled' : 'disabled';
                toast.success(`User registry successfully ${actionPerformed}!`);
            },
            onError: () => {
                toast.error('Failed to update the target user status registry configuration.');
            }
        });
    };

    return (
        <div className="max-w-[500px] mx-auto mt-10 flex flex-col gap-4">
            <Heading 
                title={`${user.first_name} ${user.last_name} profile`} 
                description={`${user.first_name} ${user.last_name} profile details in ASSISTENZ365`} 
            />
            <UserImage className="mx-auto mb-4" user={user} widthHeight={200} />
            <TextFieldData label="Username" value={user.username} />
            <TextFieldData label="Role" value={user.role} />
            <TextFieldData label="Full name" value={`${user.first_name} ${user.last_name}`} />
            <TextFieldData label="Email" value={user.email} />
            <TextFieldData label="Phone" value={user.phone} />
            <TextFieldData label="Address" value={user.adress} />
            <TextFieldData label="Disabled" value={user.disabled ? 'Yes' : 'No'} />
            <TextFieldData label="Verified" value={user.is_verified ? 'Yes' : 'No'} />

            <div className="mt-5 flex gap-4 justify-evenly items-center">
                <BtnWithAction
                    title="Edit Profile"
                    message="Are you sure you want to edit this profile?"
                    confirmText="Yes"
                    cancelText="Cancel"
                    onConfirm={() => router.push(`/admin/users/${user.id}/edit`)}
                >
                    <Button variant="outlined" color='primary' className="mt-5">
                        Edit Profile
                    </Button>
                </BtnWithAction>
                <BtnWithAction
                title={user.disabled ? "Enable Profile" : "Disable Profile"}
                message={
                    user.disabled 
                        ? `Are you sure you want to enable ${user.first_name} ${user.last_name}'s profile? The user will be able to access the system again.`
                        : `Are you sure you want to disable ${user.first_name} ${user.last_name}'s profile? The user will not be able to access the system.`
                }
                confirmText={user.disabled ? "Yes, Enable" : "Yes, Disable"}
                cancelText="Cancel"
                onConfirm={handleToggleUserStatus}
                disabled={isToggling}
            >
                {!user.disabled ? (
                    <Button 
                        variant="outlined" 
                        color='error' 
                        className="mt-5"
                        disabled={isToggling}
                    >
                        {isToggling ? 'DISABLING...' : 'DISABLE Profile'}
                    </Button>
                ) : (
                    <Button 
                        variant="outlined" 
                        color='success' 
                        className="mt-5"
                        disabled={isToggling}
                    >
                        {isToggling ? 'ENABLING...' : 'ENABLE Profile'}
                    </Button>
                )}
            </BtnWithAction>
            </div>

        </div>
    )
}

export default UserDetails