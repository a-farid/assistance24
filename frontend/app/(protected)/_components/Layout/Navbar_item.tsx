"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { I_NavBarList } from "./nav_list";
interface I_NavbarItem extends I_NavBarList {
  setOpenSideBar: (open: boolean) => void;
}

const NavbarItem = ({
  icon: Icon,
  name,
  link,
  setOpenSideBar,
}: I_NavbarItem) => {
  const pathname = usePathname();

  return (
    <Link
      href={link}
      passHref
      className="flex items-center justify-between w-full max-w-[200px] font-Poppins px-6 font-[400] text-[18px] hover:opacity-70"
    >
      <Icon
        scale={22}
        className={`${
          pathname.startsWith(link)
            ? "text-[crimson] dark:text-[#37a39a]"
            : "text-black dark:text-white"
        } ml-4`}
      />
      <span
        onClick={() => {
          setOpenSideBar(false);
        }}
        className={`${
          pathname.startsWith(link)
            ? "text-[crimson] dark:text-[#37a39a] border-b-2 border-[crimson] dark:border-[#37a39a]"
            : "text-black dark:text-white"
        } w-full md:ml-4`}
      >
        {name}
      </span>
    </Link>
  );
};
export default NavbarItem;
