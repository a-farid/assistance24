"use client";
import { Avatar } from "@mui/material";
import { KeyRound, LogOut, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/lib/features/auth/authApi";
import { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  user: any;
  setOpenProileBar: (value: boolean) => void;
};

function Profile({ user, setOpenProileBar }: Props) {
  const router = useRouter();
  const [logout, { data, isLoading, isSuccess }] = useLogoutMutation();
  const handleLogout = () => {
    logout({});

    if (isSuccess) {
      router.push("/login");
      toast.success(data.message || "User logged out successfully");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/login");
      toast.success(data.message || "User logged out successfully");
    }
  }, [isSuccess, router, data]);
  if (!user) return null;
  return (
    <>
      <div className="absolute right-10 top-10 w-[280px] border p-2 bg-gradient-global">
        <div className="flex items-center justify-center flex-col w-full">
          <div className="flex items-center justify-evenly w-full py-5">
            <Avatar
              alt={`${user.username} photo profile`}
              // src={user.url_photo ? user.url_photo : avatar}
              src={"http://localhost:8000/api/images/1.png"}
            />
            <div>
              <h1 className="w-full text-center font-bold text-[15px]">
                Mr {user.username}
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
                  setOpenProileBar(false);
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
                disabled={isLoading}
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
