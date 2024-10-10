"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { PatientColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";

interface PatientClientProps {
  data: PatientColumn[];
}

const PatientClient: React.FC<PatientClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Patients (${data.length})`}
          description="Manage patients for your facility."
        />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default PatientClient;
