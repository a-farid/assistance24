"use client";
import Heading from "@/components/custom/Heading";
import React from "react";
import { useAppSelector } from "@/lib/hooks";

type Props = {};

const Profile = (props: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <div>
      <Heading title={"farid profile"} description="farid prof" />
      Profile page
    </div>
  );
};

export default Profile;
