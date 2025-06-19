"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { userLoggedOut, userLoggedIn } from "@/lib/features/auth/authSlice";
import { apiSlice } from "@/lib/features/api/apiSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import toast from "react-hot-toast";

interface Props {
  children: React.ReactNode;
}

const Protected = ({ children }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // If user exists, no need to check further
      if (user) {
        setIsChecking(false);
        return;
      }

      // If no user, try to refresh token to get user data
      try {
        console.log('No user found, attempting to refresh token...');
        const result = await dispatch(apiSlice.endpoints.refreshToken.initiate({})).unwrap();
        console.log('Token refresh successful');
        
        // Manually dispatch userLoggedIn with the returned data
        dispatch(userLoggedIn({
          access_token: result.data.access_token,
          user: result.data.user,
        }));
        
        setIsChecking(false);
      } catch (error: any) {
        console.log('Token refresh failed:', error);
        
        // Check if it's a 401 error or any other error that indicates authentication failure
        if (error?.status === 401 || error?.originalStatus === 401) {
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error("You are not logged in. Please log in to continue.");
        }
        
        dispatch(userLoggedOut());
        router.push("/login");
      }
    };

    checkAuth();
  }, [dispatch, router, user]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if user exists
  return user ? <>{children}</> : null;
};

export default Protected;