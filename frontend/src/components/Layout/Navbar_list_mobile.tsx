// "use client";
import { RootState } from "@/lib/store";
import NavbarItem from "./Navbar_item";
import { ROUTE_SECURITY, I_NavBarList, SystemRole } from "../../lib/constants/navigation";
import { useEffect, useState } from "react";
import { useAuthAuthorization, useAuthStore } from "@/lib/store/authStore";

type Props = {
  setOpenSideBar: (open: boolean) => void;
};

export const Navbar_list_mobile = ({ setOpenSideBar }: Props) => {
     const { user, isAuthenticated } = useAuthAuthorization();
    
      const userRole = (user?.role as SystemRole) || null;
    
      // 💡 Pure Architectural Filter Pipeline: Done completely at the parent container level!
      const authorizedMenu = ROUTE_SECURITY.filter(
        (menuItem) => isAuthenticated && userRole && menuItem.roles.includes(userRole)
      );
    
  return (
    <div className="bg-gray-50 dark:bg-slate-800 absolute left-0  w-full h-screen top-[80px]">
      <div className="w-full py-6 text-center flex items-center flex-col gap-6">
        {authorizedMenu.map((item, index) => (
          <NavbarItem key={index} setOpenSideBar={setOpenSideBar} {...item} />
        ))}
      </div>
      <br />
      <br />
      <p className="text-center mt-40 text-gray-500">
        Copyright (c) Assistance24. All rights reserved.
      </p>
    </div>
  );
};
