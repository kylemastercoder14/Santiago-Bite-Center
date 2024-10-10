"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ServiceColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";

interface ServiceClientProps {
  data: ServiceColumn[];
}

const ServiceClient: React.FC<ServiceClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Services (${data.length})`}
          description="Manage services for your facility."
        />
        {/* <Button
          variant="destructive"
          onClick={() => router.push(`/admin/dashboard/service/new`)}
        >
          <Plus className="mr-2 w-4 h-4" />
          Add New Service
        </Button> */}
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default ServiceClient;
