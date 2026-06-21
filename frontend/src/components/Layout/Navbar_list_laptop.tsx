"use client";
import { useAuthAuthorization } from "@/lib/auth/authStore";
import NavbarItem from "./Navbar_item";
import { ROUTE_SECURITY, SystemRole } from "../../lib/constants/navigation";


type Props = {
  setOpenSideBar: (open: boolean) => void;
};

interface SidebarProps {
  setOpenSideBar: (open: boolean) => void;
}
export const Navbar_list_laptop = ({ setOpenSideBar }: Props) => {
  const { user, isAuthenticated } = useAuthAuthorization();

  const userRole = (user?.role as SystemRole) || null;

  // 💡 Pure Architectural Filter Pipeline: Done completely at the parent container level!
  const authorizedMenu = ROUTE_SECURITY.filter(
    (menuItem) => isAuthenticated && userRole && menuItem.roles.includes(userRole)
  );

  return (
    <>
      <div className="hidden 900px:flex">
        {authorizedMenu.map((item, index) => (
          <NavbarItem key={index} setOpenSideBar={setOpenSideBar} {...item} />
        ))}
      </div>
    </>
  );
};
