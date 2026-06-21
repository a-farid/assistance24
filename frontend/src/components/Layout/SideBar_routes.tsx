"use client";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import SidebarItem from "./SideBar_Item";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ROUTE_SECURITY, SystemRole } from "../../lib/constants/navigation";
import { useAuthAuthorization } from "@/lib/store/authStore";

type Props = {};

function SideBar_routes({}: Props) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const pathName = usePathname();
  
  // 1. Ingress the active session metadata from the global cache
  const { user, isAuthenticated } = useAuthAuthorization();
  const userRole = (user?.role as SystemRole) || null;
  
  // 💡 2. Pure Pipeline: Filter sub-items matching the active path prefix AND user role clearance
  const getAuthorizedSubItems = () => {
    if (!isAuthenticated || !userRole) return [];

    // Identify the active top-level section array block (e.g., matching '/contracts')
    const activeParentRoute = ROUTE_SECURITY.find((item) => pathName.startsWith(item.link));
    if (!activeParentRoute) return [];

    // Filter sub-items: items are valid if they don't specify roles, or if the user's role is permitted
    return (activeParentRoute.subItems || []).filter(
      (subItem) => !subItem.roles || subItem.roles.includes(userRole)
    );
  };

  const visibleItems = getAuthorizedSubItems();

  // If no elements pass our authorization rules, unmount the layout container completely
  if (visibleItems.length === 0) return null;

  
  return (
    <Box
      sx={{ width: 224 }}
      role="Sidebar content"
      onClick={() => toggleDrawer(false)}
    >
      <List className="h-full">
        {visibleItems.map((text) => (
          <SidebarItem key={text.label} {...text} />
        ))}
      </List>
    </Box>
  );
}

export default SideBar_routes;
