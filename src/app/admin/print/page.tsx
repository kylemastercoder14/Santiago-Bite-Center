import db from "@/lib/db";
import Image from "next/image";
import React from "react";

const PrintReport = async () => {
  const appointments = await db.appointment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });
  const billings = await db.billing.findMany();
  const billingItems = await db.billingItem.findMany();
  return (
    <>
      <div className="flex max-w-7xl py-5 mx-auto items-center">
        <div className="flex items-center">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          <Image
            src="/images/santiago-text.jpg"
            alt="Logo"
            width={150}
            height={150}
          />
        </div>
        <Image
          src="/images/santiago-address.jpg"
          alt="Logo"
          width={300}
          height={300}
        />
        <p className="mx-5">|</p>
        <Image
          src="/images/santiago-philhealth.jpg"
          alt="Logo"
          width={200}
          height={200}
        />
      </div>
      <div className="px-20 py-5">
        <p className="font-bold text-3xl">Daily Sales Log</p>
        <p className="text-muted-foreground text-sm">
          Generated on {new Date().toLocaleDateString()}
        </p>
        {appointments.map((item) => (
          <div className="flex flex-col mt-5" key={item.id}>
            <p>{item.date}</p>
          </div>
        ))}

        {billings.map((item) => (
          <div className="flex flex-col mt-5" key={item.id}>
            <p>{item.userCategory}</p>
          </div>
        ))}

        {billingItems.map((item) => (
          <div className="flex flex-col mt-5" key={item.id}>
            <p>{item.billingId}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default PrintReport;
