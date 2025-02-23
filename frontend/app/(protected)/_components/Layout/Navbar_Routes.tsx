"use client";
import { Navbar_list_laptop } from "./Navbar_list_laptop";
import { ThemeSwitcher } from "@/components/custom/themeSwitcher";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useState } from "react";
import NotificationsCount from "@/app/(protected)/_components/Layout/NotificationsCount";
import { useAppSelector } from "@/lib/hooks";
import AvatarProfile from "./AvatarProfile";
import { Navbar_list_mobile } from "./Navbar_list_mobile";

const NavbarRoutes = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [openNotificationsBar, setOpenNotificationsBar] = useState(false);
  const [openProileBar, setOpenProileBar] = useState(false);
  const { user } = useAppSelector((state: any) => state.auth);
  const resetStates = () => {
    setOpenSideBar(false);
    setOpenNotificationsBar(false);
    setOpenProileBar(false);
  };

  return (
    <div className="flex items-center justify-between gap-x-2 p-4 h-[84px] w-full py-2">
      <div className="flex items-center ml-auto">
        <Navbar_list_laptop setOpenSideBar={setOpenSideBar} />
        <NotificationsCount
          openNotificationsBar={openNotificationsBar}
          setOpenNotificationsBar={setOpenNotificationsBar}
        />
        <ThemeSwitcher />
        <AvatarProfile
          user={user}
          openProileBar={openProileBar}
          setOpenProileBar={setOpenProileBar}
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
