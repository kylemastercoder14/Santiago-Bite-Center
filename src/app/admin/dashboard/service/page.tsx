import React from "react";
import { format } from "date-fns";
import db from "@/lib/db";
import ServiceClient from "./components/client";
import { ServiceColumn } from "./components/column";
import { formatPrice } from "@/lib/utils";

const Services = async () => {
  const services = await db.service.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedServices: ServiceColumn[] = services.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    price: formatPrice(item.price),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServiceClient data={formattedServices} />
      </div>
    </div>
  );
};

export default Services;
