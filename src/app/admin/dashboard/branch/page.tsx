import React from "react";
import { format } from "date-fns";
import db from "@/lib/db";
import { BranchColumn } from "./components/column";
import BranchClient from "./components/client";

const Branches = async () => {
  const branches = await db.branch.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBranches: BranchColumn[] = branches.map((item) => ({
    id: item.id,
    name: item.name,
    contact: item.contact,
    address: item.address,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BranchClient data={formattedBranches} />
      </div>
    </div>
  );
};

export default Branches;
