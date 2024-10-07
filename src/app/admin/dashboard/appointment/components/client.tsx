"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { AppointmentColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";

interface AppointmentClientProps {
  data: AppointmentColumn[];
}

const AppointmentClient: React.FC<AppointmentClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Appointment Records (${data.length})`}
          description="Manage appointments for your facility."
        />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default AppointmentClient;
