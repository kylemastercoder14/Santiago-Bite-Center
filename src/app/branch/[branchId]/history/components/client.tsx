"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { columns, HistoryColumn } from "./column";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

interface HistoryClientProps {
  data: HistoryColumn[];
}

const HistoryClient: React.FC<HistoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Patient Histories (${data.length})`}
          description="Manage patient histories for your facility."
        />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default HistoryClient;
