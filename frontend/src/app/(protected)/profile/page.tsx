"use client";
import Heading from "@/components/custom/Heading";
import React from "react";
import { useAppSelector } from "@/lib/hooks";
import LinesSkeleton from "@/components/skeleton/LinesSkeleton";
import TextFieldData from "@/components/shared/TextFieldData";
import { Button } from "@mui/material";

type Props = {};

const Profile = (props: Props) => {
  const user = useAppSelector((state:any) => state.auth.user);
  console.log('user', user);
  if(!user) return <LinesSkeleton />;
  return (
    <div className="max-w-[500px] mx-auto mt-10 flex flex-col gap-4">
      <Heading title={"farid profile"} description="farid prof" />
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

export default Profile;
