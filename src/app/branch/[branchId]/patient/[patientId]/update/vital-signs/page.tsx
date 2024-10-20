"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PatientProps } from "../page";
import { getPatientById } from "@/actions/patients";
import VitalSignCard from "../_components/vital-sign-card";

const VitalSigns = () => {
  const params = useParams();
  const [patient, setPatient] = useState<PatientProps | null>(null);
  useEffect(() => {
    const fetchPatient = async () => {
      const response = await getPatientById(
        Array.isArray(params?.patientId)
          ? params.patientId[0]
          : params.patientId
      );
      if (response.data) {
        setPatient(response.data);
      }
    };

    fetchPatient();
  }, [params.patientId]);
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="grid w-full gap-2">
        <h1 className="text-3xl font-semibold">Update Patient Record</h1>
      </div>
      <div className="grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link
            href={`/branch/${params.branchId}/patient/${params.patientId}/update`}
          >
            General
          </Link>
          <Link
            href={`/branch/${params.branchId}/patient/${params.patientId}/update/vital-signs`}
            className="font-semibold text-primary"
          >
            Vital Signs
          </Link>
          <Link
            href={`/branch/${params.branchId}/patient/${params.patientId}/update/medical`}
          >
            Medical
          </Link>
          <Link
            href={`/branch/${params.branchId}/patient/${params.patientId}/update/incident`}
          >
            Incident
          </Link>
          <Link
            href={`/branch/${params.branchId}/patient/${params.patientId}/update/treatment`}
          >
            Treatment
          </Link>
        </nav>
        <div className="grid gap-6">
        {patient && <VitalSignCard initialData={patient} />}
        </div>
      </div>
    </main>
  );
};

export default VitalSigns;
