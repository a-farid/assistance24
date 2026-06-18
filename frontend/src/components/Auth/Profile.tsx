"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useLogoutMutation } from "@/lib/api/auth"; // Standardized naming targeting TanStack
import log from "@/utils/logger";
import { Avatar } from "@mui/material";
import { KeyRound, LogOut, UserCog } from "lucide-react";

type Props = {
  user: any;
  setOpenProfileBar: (value: boolean) => void; // Fixed minor typo in prop signature name
};

function Profile({ user, setOpenProfileBar }: Props) {
  const router = useRouter();
  
  // 💡 1. Initialize our decoupled TanStack logout execution tunnel
  const { mutate: logout, isPending } = useLogoutMutation();

  // 💡 2. Clean Streamlined Event Handler
   const handleLogout = () => {
    log.info("ProfileBar", "Initiating session termination sequence...");
    
    logout(undefined, {
      onSuccess: (responseData: any) => {
        const message = responseData?.message || "Logged out successfully.";
        toast.success(message);
        setOpenProfileBar(false);
        
        // At this point, Zustand memory is already 100% clean because onSettled fired first.
        // The Protected wrapper will see isAuthenticated = false and ignore this component.
        router.push("/login"); 
      },
      onError: (error: any) => {
        log.error("ProfileBar", "Logout network request exception:", error);
        // Force the redirect even on a network failure to avoid trapping the user
        router.push("/login");
      }
    });
  };

  // Safe Fallback Resolution for System Image Assets
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://api.dev.local/api";
  const isValidPhoto = user?.url_photo && user.url_photo !== "string" && user.url_photo.trim() !== "";
  const avatarPhoto = isValidPhoto ? `${baseUrl}/${user.url_photo}` : `${baseUrl}/images/default.png`;
  return (
    <>
      <div className="absolute right-10 top-10 w-[280px] border p-2 bg-gradient-global text-black dark:bg-slate-900 dark:text-white rounded-md shadow-lg">
        <div className="flex items-center justify-center flex-col w-full">
          <div className="flex items-center justify-evenly w-full py-5">
            <Avatar
              alt={`${user.username} photo profile`}
              src={avatarPhoto}
            />
            <div>
              <h1 className="w-full text-center font-bold text-[15px]">
                Mr  {user.username}
              </h1>
              <p className="w-full text-center">{user.departement}</p>
            </div>
          </div>
          <div className="w-full px-5">
            <div className="flex items-center justify-center flex-col text-[5px]">
              <button
                className="w-full h-6 p-3 flex py-5 items-center justify-between gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 hover:opacity-90 cursor-pointer"
                onClick={() => {
                  router.push("/profile");
                  setOpenProfileBar(false);
                }}
              >
                <UserCog />
                <span className="font-bold text-[15px] w-full">
                  mon Profile
                </span>
              </button>
              <button
                className="w-full h-6 p-3 flex py-5 items-center justify-between gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 hover:opacity-90 cursor-pointer"
                onClick={() => router.push("/profile/change-password")}
              >
                <KeyRound />
                <span className="font-bold text-[15px] w-full">
                  Changer mot de passe
                </span>
              </button>
              <button
                className="w-full h-6 p-3 flex py-5 items-center justify-between gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105 hover:opacity-90 cursor-pointer"
                onClick={handleLogout}
                disabled={isPending}
              >
                <LogOut />
                <span className="font-bold text-[15px] w-full">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
