"use client";
import Heading from "@/components/custom/Heading";
import React from "react";
import { useAuthStore } from "@/lib/store/authStore";
import LinesSkeleton from "@/components/shared/LinesSkeleton";
import TextFieldData from "@/components/shared/TextFieldData";
import { Button, Fab } from "@mui/material";
import UserImage from "@/app/(auth)/_components/UserPhoto";

type Props = {};

const ProfilePage = (props: Props) => {

  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <LinesSkeleton />;
  }

  return (
    <div className="max-w-[500px] mx-auto mt-10 flex flex-col gap-4">
      <Heading title={"farid profilePage"} description="farid prof" />
      <UserImage className="mx-auto mb-4" user={user} widthHeight={200} />
      <TextFieldData label="Username" value={user?.username} />
      <TextFieldData label="Role" value={user?.role} />
      <TextFieldData label="Full name" value={`${user?.first_name} ${user?.last_name}`} />
      <TextFieldData label="Email" value={user?.email} />
      <TextFieldData label="Phone" value={user?.phone} />
      <TextFieldData label="Adress" value={user?.adress} />

      <Button variant="outlined" className="mt-5" href="/profile/edit">
        Update Profile
      </Button>
    </div>
  );
};

export default ProfilePage;
