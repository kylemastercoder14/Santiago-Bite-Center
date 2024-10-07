
import BranchForm from "@/components/forms/branch-form";
import ServiceForm from "@/components/forms/service-form";
import db from "@/lib/db";
import React from "react";

const ServicePage = async ({ params }: { params: { serviceId: string } }) => {
  const service = await db.service.findUnique({
    where: {
      id: params.serviceId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServiceForm initialData={service} />
      </div>
    </div>
  );
};

export default ServicePage;
