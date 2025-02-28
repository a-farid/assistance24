"use client";
import { ChevronsRight, Menu } from "lucide-react";
import { useState } from "react";
import { Button, Drawer } from "@mui/material";
import Sidebar from "./Sidebar";

const MobileSideBar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  return (
    <>
      <Button
        onClick={toggleDrawer(true)}
        className="900px:hidden hover:opacity-75 transition z-50 mr-auto dark:text-white ml-[-20px]"
        variant="text"
      >
        <ChevronsRight size={24} />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Sidebar />
      </Drawer>
    </>
  );
};

export default MobileSideBar;
