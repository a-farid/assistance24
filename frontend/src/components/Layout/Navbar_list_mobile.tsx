// "use client";
import { RootState } from "@/lib/store";
import NavbarItem from "./Navbar_item";
import { admin_navbar_list, client_navbar_list, I_NavBarList, worker_navbar_list } from "./nav_list";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";

type Props = {
  setOpenSideBar: (open: boolean) => void;
};

export const Navbar_list_mobile = ({ setOpenSideBar }: Props) => {
      const { user } = useAppSelector((state: RootState) => state.auth);
  
      const [navbar_list, setNavbarList] = useState<I_NavBarList[]>([]);

      useEffect(() => {
        if (user?.role === "client") {
          setNavbarList(client_navbar_list);
        } else if (user?.role === "worker") {
          setNavbarList(worker_navbar_list);
        } else {
          setNavbarList(admin_navbar_list);
        }
      }, [user]);
  return (
    <div className="bg-gray-50 dark:bg-slate-800 absolute left-0  w-full h-screen top-[80px]">
      <div className="w-full py-6 text-center flex items-center flex-col gap-6">
        {navbar_list.map((item, index) => (
          <NavbarItem key={index} setOpenSideBar={setOpenSideBar} {...item} />
        ))}
      </div>
      <br />
      <br />
      <p className="text-center mt-40 text-gray-500">
        Copyright (c) section de development UTAJ 2024
      </p>
    </div>
  );
};
