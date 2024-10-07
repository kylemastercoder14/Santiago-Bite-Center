"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { EmployeeColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";

interface EmployeeClientProps {
  data: EmployeeColumn[];
}

const EmployeeClient: React.FC<EmployeeClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Employees (${data.length})`}
          description="Manage employees for your facility."
        />
        <Button
          variant="destructive"
          onClick={() => router.push(`/admin/dashboard/employee/new`)}
        >
          <Plus className="mr-2 w-4 h-4" />
          Add New Employee
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default EmployeeClient;
