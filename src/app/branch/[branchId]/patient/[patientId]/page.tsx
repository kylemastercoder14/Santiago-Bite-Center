import db from "@/lib/db";
import React from "react";
import PatientProfiling from "../components/patient-profiling";

const PatientPage = async ({ params }: { params: { patientId: string } }) => {
  const user = await db.user.findUnique({
    where: {
      id: params.patientId,
    },
    include: {
      VitalSign: true,
      Medical: true,
      Patient: true,
      Treatment: true,
      Incident: true,
      Appointment: true
    },
  });

  const billing = await db.billing.findFirst({
    where: {
      userId: params.patientId,
    },
    include: {
      billingItem: true,
    }
  })

  const billingItem = await db.billingItem.findMany({
    where: {
      billingId: billing?.id
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          createdAt: true,
          updatedAt: true,
        }
      }
    }
  })
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PatientProfiling initialData={user} billingData={billingItem} />
      </div>
    </div>
  );
};

export default PatientPage;
