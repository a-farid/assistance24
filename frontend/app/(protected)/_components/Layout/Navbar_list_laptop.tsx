import * as React from "react";
import NavbarItem from "./Navbar_item";
import { navbar_list } from "./nav_list";

type Props = {
  setOpenSideBar: (open: boolean) => void;
};

export const Navbar_list_laptop = ({ setOpenSideBar }: Props) => {
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
