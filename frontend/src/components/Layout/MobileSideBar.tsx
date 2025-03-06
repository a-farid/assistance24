"use client";
import { ChevronsRight, Menu } from "lucide-react";
import { useState } from "react";
import { Drawer } from "@mui/material";
import Sidebar from "./Sidebar";
import Logo from "./Logo";

const MobileSideBar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  return (
    <>
    <div className="900px:hidden">

    <Logo width={80}/>
    </div>
      <ChevronsRight size={24} className="900px:hidden cursor-pointer hover:opacity-75 transition z-50 mr-auto dark:text-white ml-[10px]" onClick={toggleDrawer(true)}/>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Sidebar />
      </Drawer>
    </>
  );
};

export default MobileSideBar;
