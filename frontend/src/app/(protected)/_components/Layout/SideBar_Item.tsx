"use client";

import { usePathname, useRouter } from "next/navigation";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { I_SidebarItem } from "../../../../utils/constants/nav-list";
import { ListItemIcon } from "@mui/material";

const SidebarItem = ({ icon: Icon, label, href }: I_SidebarItem) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ListItem
      key={href}
      disablePadding
      className={`${
        pathname.startsWith(href)
          ? "text-[crimson] dark:text-[#37a39a] border-r-8 border-[crimson] dark:border-[#37a39a]"
          : "text-black dark:text-white"
      }`}
    >
      <ListItemButton
        onClick={() => {
          router.push(href);
        }}
      >
        <ListItemIcon>
          <Icon
            scale={22}
            className={`${
              pathname.startsWith(href)
                ? "text-[crimson] dark:text-[#37a39a]"
                : "text-black dark:text-white"
            }`}
          />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};
export default SidebarItem;
