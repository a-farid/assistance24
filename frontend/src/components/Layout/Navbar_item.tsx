"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { I_NavBarList } from "./nav_list";

interface I_NavbarItemProps extends I_NavBarList {
  setOpenSideBar: (open: boolean) => void;
}

export const NavbarItem = ({
  icon: Icon,
  name,
  link,
  roles,
  setOpenSideBar,
}: I_NavbarItemProps) => {
  const pathname = usePathname();
  
  // High-performance state validation: Check if this route element matches the active viewport path location
  const isActive = pathname.startsWith(link);

  return (
    <Link
      href={link}
      // 💡 Architectural Fix: Move click listener to the link core to guarantee drawer tracking closeouts on any click area
      onClick={() => setOpenSideBar(false)}
      className="flex items-center space-x-3 w-full px-4 py-2 font-medium transition-all duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
    >
      {/* Icon Node Alignment */}
      <Icon
        size={22} // 💡 Fixed attribute mapping property: 'scale' changed to 'size'
        className={`flex-shrink-0 transition-colors duration-150 ${
          isActive
            ? "text-[crimson] dark:text-[#37a39a]"
            : "text-gray-700 dark:text-gray-300"
        }`}
      />
      
      {/* Label Text Node Element */}
      <span
        className={`w-full text-base font-normal tracking-wide transition-colors duration-150 ${
          isActive
            ? "text-[crimson] dark:text-[#37a39a] font-semibold"
            : "text-black dark:text-white"
        }`}
      >
        {name}
      </span>
    </Link>
  );
};

export default NavbarItem;