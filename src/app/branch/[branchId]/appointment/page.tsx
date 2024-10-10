import React from "react";
import { format, parseISO } from "date-fns";
import db from "@/lib/db";
import { AppointmentColumn } from "./components/column";
import AppointmentClient from "./components/client";

const Appointment = async () => {
  const appointments = await db.appointment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    }
  });

  const patient = await db.patient.findFirst({
    where: {
      userId: appointments[0]?.userId
    }
  })

  const formattedAppointments: AppointmentColumn[] = appointments.map((item) => ({
    id: item.id,
    name: item.user.firstName + " " + item.user.lastName,
    age: patient?.age || "",
    address: patient?.address || "",
    date: format(parseISO(item.date), "MMMM dd, yyyy"),
    time: item.time,
    status: item.status,
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AppointmentClient data={formattedAppointments} />
      </div>
    </div>
  );
};

export default Appointment;
