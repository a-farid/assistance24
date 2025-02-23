"use client";
import { useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const NotificationSocket = ({ onNotification }: { onNotification: any }) => {
  const user = useSelector((state: any) => state.auth.user);
  useEffect(() => {
    // const socket = io(`http://localhost:8000/user/${user.id}/notifications/`);
    const socket = io(`test`);

    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    socket.on("notification", (notification) => {
      console.log("New notification:", notification);
      onNotification(notification); // Pass notification data to parent component
    });

    return () => {
      socket.disconnect();
    };
  }, [onNotification, user]);

  return null; // Since it's managing the connection, no need to render anything
};

export default NotificationSocket;
