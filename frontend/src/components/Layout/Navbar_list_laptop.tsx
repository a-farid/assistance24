"use client";
import { useAppSelector } from "@/lib/hooks";
import NavbarItem from "./Navbar_item";
import { admin_navbar_list, client_navbar_list, I_NavBarList, worker_navbar_list } from "./nav_list";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";

type Props = {
  setOpenSideBar: (open: boolean) => void;
};

export const Navbar_list_laptop = ({ setOpenSideBar }: Props) => {
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
    <>
      <div className="hidden 900px:flex">
        {navbar_list.map((item, index) => (
          <NavbarItem key={index} setOpenSideBar={setOpenSideBar} {...item} />
        ))}
      </div>
    </>
  );
};
