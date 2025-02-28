"use client";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import SidebarItem from "./SideBar_Item";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { I_SidebarItem, admin_navbar_list } from "./nav_list";

type Props = {};

function SideBar_routes({}: Props) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const pathName = usePathname();
  const subItems = () => {
    const it = admin_navbar_list.filter((item) => pathName.startsWith(item.link));
    return it[0]?.subItems || [];
  };
  const items = subItems() as I_SidebarItem[];
  return (
    <Box
      sx={{ width: 224 }}
      role="Sidebar content"
      onClick={() => toggleDrawer(false)}
    >
      <List className="h-full">
        {items.map((text) => (
          <SidebarItem key={text.label} {...text} />
        ))}
      </List>
    </Box>
  );
}

export default SideBar_routes;
