import React from "react";
import Navbar from "./components/navbar";

const BranchLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      {children}
    </div>
  );
};

export default BranchLayout;
