
import BranchForm from "@/components/forms/branch-form";
import db from "@/lib/db";
import React from "react";

const BranchPage = async ({ params }: { params: { branchId: string } }) => {
  const branch = await db.branch.findUnique({
    where: {
      id: params.branchId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BranchForm initialData={branch} />
      </div>
    </div>
  );
};

export default BranchPage;
