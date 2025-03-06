"use client";
import { useState } from "react";
import { Badge, IconButton } from "@mui/material"; // Assuming you're using Material-UI
import { Bell } from "lucide-react";
import { useTheme } from "next-themes";

import NotificationsList from "./NotificationsList";

interface Props {
  openNotificationsBar: boolean;
  setOpenNotificationsBar: (value: boolean) => void;
}

const NotificationsCount = ({openNotificationsBar, setOpenNotificationsBar}: Props) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { theme } = useTheme();

  const handleNotification = (notification: any) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };

  return (
    <div
      className="relative mx-3"
      onClick={() => setOpenNotificationsBar(!openNotificationsBar)}
    >
      <IconButton color="inherit">
        <Badge badgeContent={0} color="error">
          {theme === "light" ? (<Bell fill="black" />) : (<Bell />)}
        </Badge>
      </IconButton>
      {openNotificationsBar && (<NotificationsList setOpenNotificationsBar={setOpenNotificationsBar}/>)}
    </div>
  );
};

export default NotificationsCount;
