'use client';

import React from 'react'
import { useParams } from 'next/navigation'
import log from '@/utils/logger';
import { useGetUserByIdQuery, useToggleUserStatusMutation } from '@/lib/features/users/usersApi';
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

const UserDetails = () => {
    const params = useParams()
    const userId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    
    if (!userId) {
        log.error("UserDetails", "No userId found in params");
        return <div>Error: User ID not found</div>;
    }
    
    const { data, isLoading, isError, error } = useGetUserByIdQuery(userId);
    const [toggleUserStatus, { isLoading: isToggling }] = useToggleUserStatusMutation();

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

    const handleToggleUserStatus = async () => {
        try {
            const result = await toggleUserStatus(user.id).unwrap();
            console.log(`User ${user.disabled ? 'enabled' : 'disabled'} successfully:`, result);

            // Show success message with the CURRENT state (before toggle)
            const actionPerformed = user.disabled ? 'enabled' : 'disabled';
            toast(`User ${actionPerformed} successfully!`);
            
        } catch (error) {
            console.error('Error toggling user status:', error);
            toast('Failed to update user status. Please try again.');
        }
    };

    // ✅ Add some debug logging
    log.success("User status:", user.disabled ? "Disabled" : "Enabled");
    console.log("Current user data:", user);

    return (
        <div className="max-w-[500px] mx-auto mt-10 flex flex-col gap-4">
            <Heading 
                title={`${user.first_name} ${user.last_name} profile`} 
                description={`${user.first_name} ${user.last_name} profile details in ASSISTENZ365`} 
            />
            <div className='relative flex flex-col items-center justify-center mb-10'>
                <Fab color="info" aria-label="edit" className="absolute right-14 top-10 z-10">
                    <EditIcon />
                </Fab>
                {user.url_photo ? (
                    <Image
                        className="rounded-full mx-auto mb-4"
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${user.url_photo}`}
                        width={200}
                        height={200}
                        alt={`${user.first_name} ${user.last_name} profile picture`}
                    />
                ) : (
                    <div className="w-[200px] h-[200px] rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <span className="text-gray-500">No Photo</span>
                    </div>
                )}
            </div>
            <TextFieldData label="Username" value={user.username} />
            <TextFieldData label="Role" value={user.role} />
            <TextFieldData label="Full name" value={`${user.first_name} ${user.last_name}`} />
            <TextFieldData label="Email" value={user.email} />
            <TextFieldData label="Phone" value={user.phone} />
            <TextFieldData label="Address" value={user.adress} />
            <TextFieldData label="Disabled" value={user.disabled ? 'Yes' : 'No'} />
            <TextFieldData label="Verified" value={user.is_verified ? 'Yes' : 'No'} />

            <Button variant="outlined" className="mt-5" href="/profile/edit">
                Update Profile
            </Button>
            
            <BtnWithAction
                title="Edit Profile"
                message="Are you sure you want to edit this profile?"
                confirmText="Yes, Edit"
                cancelText="Cancel"
                onConfirm={handleEditProfile}
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
    )
}

export default UserDetails