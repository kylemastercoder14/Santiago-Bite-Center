"use client";

import { Medical, Patient, Treatment, User, VitalSign } from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface PatientProfilingProps {
  initialData:
    | (User & {
        Patient: Patient[];
        Medical: Medical[];
        VitalSign: VitalSign[];
        Treatment: Treatment[];
      })
    | null;
}

const PatientProfiling = ({ initialData }: PatientProfilingProps) => {
  const patient = initialData?.Patient?.[0];
  const vitalSign = initialData?.VitalSign?.[0];

  if (!initialData) return <p>No Profiling Found</p>;

  return (
    <>
      <p className="font-bold text-lg mb-2">General Information:</p>
      <div className="flex items-center gap-3">
        <div className="flex col-span-1 mr-5 items-center gap-2">
          <p className="font-semibold">Name: </p>
          <p>
            {initialData?.firstName || "N/A"} {initialData?.lastName || "N/A"}
          </p>
        </div>
        <div className="flex col-span-1 mr-5 items-center gap-2">
          <p className="font-semibold">Email Address: </p>
          <p>{initialData?.email || "N/A"}</p>
        </div>
        <div className="flex col-span-1 mr-20 items-center gap-2">
          <p className="font-semibold">Date Created: </p>
          <p>
            {initialData?.createdAt
              ? format(new Date(initialData.createdAt), "MMMM dd, yyyy")
              : "N/A"}
          </p>
        </div>
        <div className="flex items-center col-span-2 gap-2">
          <p className="font-semibold">Address: </p>
          <p>{patient?.address || "N/A"}</p>
        </div>
      </div>
      <div>
        <p className="font-semibold">
          Age: <span className="font-normal">{patient?.age || "N/A"}</span>
        </p>
        <p className="font-semibold">
          Sex: <span className="font-normal">{patient?.sex || "N/A"}</span>
        </p>
        <p className="font-semibold">
          Civil Status:{" "}
          <span className="font-normal">{patient?.civilStatus || "N/A"}</span>
        </p>
        <p className="font-semibold">
          Contact Number:{" "}
          <span className="font-normal">{patient?.contactNumber || "N/A"}</span>
        </p>
        <p className="font-semibold">
          Next of Kin: <span className="font-normal">{patient?.nextKin || "N/A"}</span>
        </p>
      </div>
      <Separator />
      <div>
        <p className="font-bold text-lg mb-2">Vital Signs:</p>
        <p className="font-semibold">
          Temperature:{" "}
          <span className="font-normal">{vitalSign?.temperature || "N/A"} C</span>
        </p>
        <p className="font-semibold">
          Weight in KG: <span className="font-normal">{vitalSign?.weight || "N/A"}</span>
        </p>
        <p className="font-semibold">
          Pulse: <span className="font-normal">{vitalSign?.pulse || "N/A"}</span>
        </p>
        <p className="font-semibold">
          Respiration:{" "}
          <span className="font-normal">{vitalSign?.respiration || "N/A"}</span>
        </p>
        <p className="font-semibold">
          Blood Pressure:{" "}
          <span className="font-normal">{vitalSign?.bloodPressure || "N/A"}</span>
        </p>
        <p className="font-semibold">
          Last Intake:{" "}
          <span className="font-normal">
            {vitalSign?.lastIntake
              ? format(new Date(vitalSign.lastIntake), "MMMM dd, yyyy")
              : "N/A"}
          </span>
        </p>
        <p className="font-semibold">
          Last Output:{" "}
          <span className="font-normal">
            {vitalSign?.lastOutput
              ? format(new Date(vitalSign.lastOutput), "MMMM dd, yyyy")
              : "N/A"}
          </span>
        </p>
      </div>
      <Separator />
      <div>
        <p className="font-bold text-lg mb-2">Medical History:</p>
        <p className="font-semibold">
          Illness:{" "}
          <span className="font-normal">
            {initialData?.Medical?.length
              ? initialData.Medical.map((item) => item.illness || "N/A").join(", ")
              : "N/A"}
          </span>
        </p>
        <p className="font-semibold">
          Medications:{" "}
          <span className="font-normal">
            {initialData?.Medical?.length
              ? initialData.Medical.map((item) => item.medication || "N/A").join(", ")
              : "N/A"}
          </span>
        </p>
        <p className="font-semibold">
          Dosage:{" "}
          <span className="font-normal">
            {initialData?.Medical?.length
              ? initialData.Medical.map((item) => item.dosage || "N/A").join(", ")
              : "N/A"}
          </span>
        </p>
        <p className="font-semibold">
          Post Surgeries:{" "}
          <span className="font-normal">
            {initialData?.Medical?.length
              ? initialData.Medical.map((item) => item.postSurgeries || "N/A").join(", ")
              : "N/A"}
          </span>
        </p>
      </div>
      <Separator />
      <div>
        <p className="font-bold text-lg mb-2">Treatment History:</p>
        <p className="font-semibold">
          Treatment Date:{" "}
          <span className="font-normal">
            {initialData?.Treatment?.[0]?.treatmentDate || "N/A"}
          </span>
        </p>
        <p className="font-semibold">
          Animal Bite Center Facility:{" "}
          <span className="font-normal">
            {initialData?.Treatment?.[0]?.biteCenter || "N/A"}
          </span>
        </p>
        <p className="font-semibold">
          Tetanus Toxoid:{" "}
          <span className="font-normal">
            {initialData?.Treatment?.length
              ? initialData.Treatment.map((item) => item.tetanusToxoid || "N/A").join(", ")
              : "N/A"}
          </span>
        </p>
        <p className="font-semibold">
          Human Tetanus Immunoglobulin:{" "}
          <span className="font-normal">
            {initialData?.Treatment?.length
              ? initialData.Treatment.map(
                  (item) => item.tetanusImmunuglobulin || "N/A"
                ).join(", ")
              : "N/A"}
          </span>
        </p>
        <p className="font-semibold">
          Anti Tetanus Serum (ERIG/HRIG):{" "}
          <span className="font-normal">
            {initialData?.Treatment?.length
              ? initialData.Treatment.map((item) => item.tetanusSerum || "N/A").join(", ")
              : "N/A"}
          </span>
        </p>
        <p className="font-semibold">
          Anti Rabies Serum (ERIG/HRIG):{" "}
          <span className="font-normal">
            {initialData?.Treatment?.length
              ? initialData.Treatment.map((item) => item.antiRabiesSerum || "N/A").join(", ")
              : "N/A"}
          </span>
        </p>
        <p className="font-semibold">
          Purified Chick Embryo Cell Vaccine:{" "}
          <span className="font-normal">
            {initialData?.Treatment?.length
              ? initialData.Treatment.map(
                  (item) => item.chickEmbryoCellVaccine || "N/A"
                ).join(", ")
              : "N/A"}
          </span>
        </p>
      </div>
    </>
  );
};

export default PatientProfiling;
