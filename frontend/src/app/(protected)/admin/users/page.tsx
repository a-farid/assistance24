"use client"
import Loading from "@/components/custom/Loading";
import { useGetUsersQuery } from "@/lib/features/users/usersApi";
import { IUser } from "@/utils/interface/user_interfaces";
import { Avatar, Button } from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";



type Props = {};

const page = (props: Props) => {

  const { data, error, isLoading } = useGetUsersQuery("users");

  if (error) return <p>Error loading users</p>;

  // return <p>Test</p>
  return (
    <div className="w-full bg-amber-300">
      {isLoading ? <Loading/> : data.data.map((user: IUser) => (
          <ul key={user.id} className="grid grid-cols-3 p-2">
                      <Avatar
            alt={`${user.username} photo profile`}
            src={user.url_photo ? user.url_photo : "http://localhost:8000/api/images/1.png"}
          />
            <li className="my-2">{user.first_name} {user.last_name}</li>
            <li>{user.email}</li>
            <li>{user.role}</li>
          </ul>
        ))}
    </div>
  );
};

export default page;
