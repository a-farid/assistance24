"use client";
import Heading from "@/components/custom/Heading";
import React from "react";
import { useAppSelector } from "@/lib/hooks";

type Props = {};

const Profile = (props: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  if(!user) return null
  return (
    <div>
      <Heading title={"farid profile"} description="farid prof" />
      <h3>Full name: {user?.first_name} {user?.last_name}</h3>
      <h3>Adresse: {user?.adress}</h3>
    </div>
  );
};

export default Profile;
