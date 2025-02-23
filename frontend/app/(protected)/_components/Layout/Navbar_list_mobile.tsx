// "use client";
import * as React from "react";
import NavbarItem from "./Navbar_item";
import { navbar_list } from "./nav_list";

type Props = {
  setOpenSideBar: (open: boolean) => void;
};

export const Navbar_list_mobile = ({ setOpenSideBar }: Props) => {
  return (
    <div className="md:hidden bg-gray-50 dark:bg-slate-800 absolute left-0  w-full h-screen top-[80px]">
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
