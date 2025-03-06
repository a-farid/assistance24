// "use client";
// import { useAppSelector } from "@/lib/hooks";
// import { RootState } from "@/lib/store";
// import { useRouter } from "next/navigation";
// import { useEffect, ReactNode, useState } from "react";
// import toast from "react-hot-toast";

// const Layout = ({ children }: { children: ReactNode }) => {
//   const router = useRouter();
//   const { user } = useAppSelector((state: RootState) => state.auth);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user) {
//       setLoading(true); // Prevent rendering before Redux loads
//     } else {
//       setLoading(false);
//       if (user.role !== "admin") {
//         toast.error("You are not authorized to view this page");
//         router.push("/");
//       }
//     }
//   }, [user, router]);

//   if (loading) {
//     return <p className="text-center">Loading...</p>; // ✅ Prevents hydration errors
//   }

//   return <>{children}</>;
// };

// export default Layout;
