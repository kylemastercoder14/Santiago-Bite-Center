"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Topbar = () => {
  const router = useRouter();
  return (
    <div className="px-4 mb-4 mt-2 pb-4">
      <div className="flex justify-between items-center p-0.5">
        <div>
          <span className="text-lg font-bold block">
            👋 Welcome back, Admin!
          </span>
          <span className="text-sm block text-muted-foreground">
            This is the admin dashboard.
          </span>
        </div>
        {/* <Button onClick={() => router.push("/admin/print")} variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Print Report
        </Button> */}
      </div>
    </div>
  );
};

export default Topbar;
