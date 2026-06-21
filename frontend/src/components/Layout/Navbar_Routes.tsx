"use client";
import { Navbar_list_laptop } from "./Navbar_list_laptop";
import { ThemeSwitcher } from "@/components/custom/themeSwitcher";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useState } from "react"; 
// import NotificationsCount from "@/components/Layout/NotificationsCount";
import AvatarProfile from "@/components/Layout/AvatarProfile";
import { Navbar_list_mobile } from "./Navbar_list_mobile";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";
import { useAuthStore } from "@/lib/store/authStore";

const NavbarRoutes = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [openNotificationsBar, setOpenNotificationsBar] = useState(false);
  const [openProfileBar, setOpenProfileBar] = useState(false);

  const { user } = useAuthStore();
  
  const resetStates = () => {
    setOpenSideBar(false);
    setOpenNotificationsBar(false);
    setOpenProfileBar(false);
  };
  return (
    <div className="flex items-center justify-between gap-x-2 p-4 h-[84px] w-full py-2">
      <div className="flex items-center ml-auto">
        <Navbar_list_laptop setOpenSideBar={setOpenSideBar} />
        {/* <NotificationsCount
          openNotificationsBar={openNotificationsBar}
          setOpenNotificationsBar={setOpenNotificationsBar}
        /> */}
        <ThemeSwitcher />
        <LocaleSwitcher />
        <AvatarProfile
          user={user}
          openProfileBar={openProfileBar}
          setOpenProfileBar={setOpenProfileBar}
        />
        <div className="900px:hidden" id="sideBarMenuBtn">
          <HiOutlineMenuAlt3
            className="text-3xl cursor-pointer ml-3 "
            onClick={() => {
              resetStates();
              setOpenSideBar(!openSideBar);
            }}
          />
        </div>
      </div>
      {openSideBar && <Navbar_list_mobile setOpenSideBar={setOpenSideBar} />}
    </div>
  );
};

export default NavbarRoutes;
