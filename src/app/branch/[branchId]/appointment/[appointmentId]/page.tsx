import AppointmentForm from "@/components/forms/appointment-form";
import db from "@/lib/db";
import React from "react";

const AppointmentPage = async ({
  params,
}: {
  params: { appointmentId: string };
}) => {
  const appointment = await db.appointment.findUnique({
    where: {
      id: params.appointmentId,
    },
    include: {
      user: true,
    },
  });

  const user = await db.user.findUnique({
    where: {
      id: appointment?.userId,
    },
  });

  const billing = await db.billing.findFirst({
    where: {
      userId: user?.id,
    },
  });

  const services = await db.service.findMany();
  const vaccinations = await db.inventory.findMany();

  const billingItems = await db.billingItem.findMany({
    where: {
      billingId: billing?.id,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AppointmentForm
          site="branchManager"
          vaccinations={vaccinations}
          userData={user}
          initialData={appointment}
          services={services}
          billing={billing}
          billingItems={billingItems}
        />
      </div>
    </div>
  );
};

export default AppointmentPage;
