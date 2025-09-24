/**
 * Enhanced Protected Layout with New Auth System
 * Replace your existing protected layout with this improved version
 */

import { Navbar } from "../../components/Layout/Navbar";
import Sidebar from "../../components/Layout/Sidebar";
import React from "react";
import { Protected } from "../../components/Auth/ProtectedRoute.enhanced";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Protected showLoader={true}>
      <div className="flex flex-row h-full">
        <nav>
          <Navbar />
        </nav>
        <aside>
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </Protected>
  );
};

export default DashboardLayout;
