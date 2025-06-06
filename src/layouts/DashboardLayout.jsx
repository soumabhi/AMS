// src/layouts/DashboardLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 mx-3 my-2 mb-6 mr-6 rounded-xl overflow-y-auto scroll-hidden shadow-md bg-white p-6 border border-gray-200">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;