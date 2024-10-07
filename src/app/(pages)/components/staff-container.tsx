"use client";

import { getAllEmployees } from "@/actions/employee";
import { Employee } from "@prisma/client";
import Image from "next/image";
import React from "react";

const StaffContainer = () => {
  const [staff, setStaff] = React.useState<Employee[]>([]);

  React.useEffect(() => {
    const fetchStaff = async () => {
      const response = await getAllEmployees();
      setStaff(response);
    };

    fetchStaff();
  }, []);

  return (
    <div className="px-20 mt-5 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
      {staff.map((item) => (
        <div key={item.id} className="flex flex-col">
          {item.imageUrl ? (
            <div className="w-full h-[500px] relative">
              <Image
                src={item.imageUrl}
                alt="Image"
                fill
                className="w-full h-full rounded-lg"
              />
            </div>
          ) : (
            <div className="w-full h-[500px] flex flex-col items-center justify-center bg-zinc-200 relative rounded-lg">
              <p className="text-6xl font-bold">
                {item.firstName.charAt(0)} {item.lastName.charAt(0)}
              </p>
            </div>
          )}
          <p className="text-2xl font-semibold mt-2">{item.firstName} {item.lastName}</p>
          <p className="text-muted-foreground font-semibold">{item.role}</p>
        </div>
      ))}
    </div>
  );
};

export default StaffContainer;
