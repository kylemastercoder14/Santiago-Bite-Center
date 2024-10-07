"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { BranchColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";

interface BranchClientProps {
  data: BranchColumn[];
}

const BranchClient: React.FC<BranchClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Branches (${data.length})`}
          description="Manage branches for your facility."
        />
        <Button
          variant="destructive"
          onClick={() => router.push(`/admin/dashboard/branch/new`)}
        >
          <Plus className="mr-2 w-4 h-4" />
          Add New Branch
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default BranchClient;
