"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { userLoggedOut } from "@/lib/features/auth/authSlice";
import { apiSlice } from "@/lib/features/api/apiSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";

interface Props {
  children: React.ReactNode;
}

const Protected = ({ children }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state: RootState) => state.auth);
  useEffect(() => {
    const loadRefresh = async () => {
      try {
        await dispatch(apiSlice.endpoints.refreshToken.initiate({})).unwrap();
      } catch (error: any) {
        dispatch(userLoggedOut());
        router.push("/login");
      }
    };
    !token && loadRefresh();
    !user;
  }, [dispatch, router, user, token]);

  return children;
};

export default Protected;
