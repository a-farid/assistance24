"use client";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode, useRef } from "react";
import toast from "react-hot-toast";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const toastShown = useRef(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      if (!toastShown.current) { // ✅ Only show toast once
        toast.error("You are not authorized to view this page");
        toastShown.current = true; // Mark toast as shown
      }
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  return <>{children}</>;
};

export default Layout;
