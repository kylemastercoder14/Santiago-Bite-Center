import React from "react";
import Navbar from "../components/navbar";
import { ModalProvider } from "@/components/modal-provider";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <ModalProvider />
      <Navbar />
      {children}
    </div>
  );
};

export default AdminLayout;
