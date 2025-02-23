"use client";
import { useState } from "react";
// import NotificationSocket from "../_hooks/NotificationSocket";
import { Badge, IconButton } from "@mui/material"; // Assuming you're using Material-UI
import { Bell } from "lucide-react";
import NotificationsList from "./NotificationsList";

interface Props {
  openNotificationsBar: boolean;
  setOpenNotificationsBar: (value: boolean) => void;
}

const NotificationsCount = ({
  openNotificationsBar,
  setOpenNotificationsBar,
}: Props) => {
  const [notifications, setNotifications] = useState<any[]>([]);

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
        <Badge badgeContent={5} color="error">
          <Bell />
        </Badge>
      </IconButton>
      {/* <NotificationSocket onNotification={handleNotification} /> */}
      {openNotificationsBar && (
        <NotificationsList setOpenNotificationsBar={setOpenNotificationsBar} />
      )}
    </div>
  );
};

export default NotificationsCount;
