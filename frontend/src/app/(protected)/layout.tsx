import { Navbar } from "./_components/Layout/Navbar";
import Sidebar from "./_components/Layout/Sidebar";
import React from "react";
import Protected from "../../components/_hooks/Protected";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row h-full">
      <nav>
        <Navbar />
      </nav>
      <aside>
        <Sidebar />
      </aside>

      <Protected>
        <main>{children}</main>
      </Protected>
    </div>
  );
};

export default DashboardLayout;
