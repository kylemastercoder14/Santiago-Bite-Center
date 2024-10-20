import React from "react";
import { format } from "date-fns";
import db from "@/lib/db";
import { PatientColumn } from "./components/column";
import PatientClient from "./components/client";

const Patient = async ({params}: {params: {branchId: string}}) => {
  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      type: "User",
    },
    include: {
      VitalSign: true,
      Medical: true,
      Patient: {include: {branch: true}},
      Treatment: true,
    },
  });

  const formattedPatient: PatientColumn[] = users.map((user) => {
    // Check if the user has any patients and select the first one
    const patient = user.Patient?.[0];
    const branch = patient?.branch?.name;
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      contact: patient?.contactNumber || "--",
      adminBranch: branch || "--",
      age: patient?.age || "--",
      sex: patient?.sex || "--",
      address: patient?.address || "--",
      createdAt: format(user.createdAt, "MMMM do, yyyy"),
    };
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PatientClient data={formattedPatient} />
      </div>
    </div>
  );
};

export default Patient;
