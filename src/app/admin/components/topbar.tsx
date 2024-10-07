import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import React from "react";

const Topbar = () => {
  return (
    <div className="px-4 mb-4 mt-2 pb-4">
      <div className="flex justify-between items-center p-0.5">
        <div>
          <span className="text-lg font-bold block">
            👋 Good morning, Kyle!
          </span>
          <span className="text-sm block text-muted-foreground">
            Wednesday, 11th September 2024
          </span>
        </div>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Prev 6 Months
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
