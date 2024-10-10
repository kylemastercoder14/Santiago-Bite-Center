"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { InventoryColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

interface InventoryClientProps {
  data: InventoryColumn[];
}

const InventoryClient: React.FC<InventoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Vaccines (${data.length})`}
          description="Manage vaccines for your facility."
        />
        <Button
          variant="destructive"
          onClick={() => router.push(`/branch/${params.branchId}/inventory/new`)}
        >
          <Plus className="mr-2 w-4 h-4" />
          Add New Vaccine
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default InventoryClient;
