"use client";

import { getAllServices } from "@/actions/service";
import { formatPrice } from "@/lib/utils";
import { Service } from "@prisma/client";
import React from "react";

const ServicesContainer = () => {
  const [services, setServices] = React.useState<Service[]>([]);

  React.useEffect(() => {
    const fetchServices = async () => {
      const response = await getAllServices();
      setServices(response);
    };

    fetchServices();
  }, []);
  return (
    <div className="flex flex-col px-20 gap-5">
      {services.map((item) => (
        <div key={item.id} className="border-b py-5">
            <p className="font-semibold text-xl">{item.name} - {formatPrice(item.price)}</p>
            <p className="text-muted-foreground text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ServicesContainer;
