"use client";
import { useState } from "react";
// import NotificationSocket from "../_hooks/NotificationSocket";
interface Props {
  setOpenNotificationsBar: (open: boolean) => void;
}
const NotificationsList = ({ setOpenNotificationsBar }: Props) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  // Function to handle new notifications
  const handleNotification = (notification: any) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };

  return (
    <div className="absolute top-[30px] right-[15px] border border-blue-900 dark:border-blue-100 bg-white dark:bg-slate-900 rounded-md p-2 w-[200px] ">
      {notifications.length === 0 && (
        <p className="w-full text-left font-bold">No notifications</p>
      )}
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification?.message}</li>
        ))}
      </ul>
      {/* <NotificationSocket onNotification={handleNotification} /> */}
    </div>
  );
};

export default NotificationsList;
