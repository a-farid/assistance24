"use client";
import MobileSideBar from "./MobileSideBar";
import NavbarRoutes from "./Navbar_Routes";

type Props = {};
export const Navbar = ({}: Props) => {
  return (
    <div className="p-4 border-b h-full flex items-center shadow-sm w-full">
      <MobileSideBar />
      <NavbarRoutes />
    </div>
  );
};
