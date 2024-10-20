"use client";

import {
  Appointment,
  Billing,
  BillingItem,
  Incident,
  Medical,
  Patient,
  Service,
  Treatment,
  User,
  VitalSign,
} from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Image from "next/image";

interface BillingWithService extends BillingItem {
  service: Service | null;
}
interface PatientProfilingProps {
  initialData:
    | (User & {
        Patient: Patient[];
        Medical: Medical[];
        VitalSign: VitalSign[];
        Treatment: Treatment[];
        Incident: Incident[];
      })
    | null;
  billingData: BillingWithService[];
}

const PatientProfiling = ({
  initialData,
  billingData,
}: PatientProfilingProps) => {
  const patient = initialData?.Patient?.[0];

  if (!initialData) return <p>No Profiling Found</p>;

  const renderProfilingImage = () => {
    // Normalize the input to lower case
    const siteOfBite = initialData.Incident[0].siteOfBite.toLowerCase();

    switch (siteOfBite) {
      case "head":
      case "neck":
        return (
          <Image
            src="/images/profiling-head.png"
            alt="Profiling Head"
            fill
            className="w-full h-full object-contain"
          />
        );
      case "shoulder":
        return (
          <Image
            src="/images/profiling-shoulder.png"
            alt="Profiling Shoulder"
            fill
            className="w-full h-full object-contain"
          />
        );
      case "arm":
      case "arms":
      case "back":
      case "chest":
        return (
          <Image
            src="/images/arm-profiling.png"
            alt="Profiling Arm"
            fill
            className="w-full h-full object-contain"
          />
        );
      case "legs":
      case "leg":
        return (
          <Image
            src="/images/profiling-legs.png"
            alt="Profiling Legs"
            fill
            className="w-full h-full object-contain"
          />
        );
      default:
        return (
          <Image
            src="/images/profiling.png"
            alt="Default Profiling"
            fill
            className="w-full h-full object-contain"
          />
        );
    }
  };

  return (
    <div className="flex flex-col mx-auto border border-black max-w-7xl">
      <p className="font-bold text-md pl-2 mb-2 w-full bg-[#839dbd]">
        Patient Information
      </p>
      <div className="grid grid-cols-10 gap-3 w-full px-3 mb-2">
        <div className="col-span-3 flex items-center gap-2">
          <p className="font-semibold">Name: </p>
          <p className="border-b border-black w-full">
            {initialData?.firstName || "N/A"} {initialData?.lastName || "N/A"}
          </p>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <p className="font-semibold">Age: </p>
          <p className="border-b border-black w-full">
            {patient?.age + " years old" || "N/A"}
          </p>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <p className="font-semibold">Sex: </p>
          <p className="border-b border-black w-full">
            {patient?.sex || "N/A"}
          </p>
        </div>
        <div className="col-span-3 flex items-center gap-2">
          <p className="font-semibold w-32">Civil Status: </p>
          <p className="border-b border-black w-full">
            {patient?.civilStatus || "N/A"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-10 gap-3 w-full px-3 mb-2">
        <div className="col-span-7 flex items-center gap-2">
          <p className="font-semibold">Address: </p>
          <p className="border-b border-black w-full">
            {patient?.address || "N/A"}
          </p>
        </div>
        <div className="col-span-3 flex items-center gap-2">
          <p className="font-semibold w-36">Contact No.: </p>
          <p className="border-b border-black w-full">
            {patient?.contactNumber || "N/A"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-10 gap-3 w-full px-3 mb-3">
        <div className="col-span-6 flex items-center gap-2">
          <p className="font-semibold w-[108px]">Next of Kin: </p>
          <p className="border-b border-black w-full">
            {patient?.nextKin || "N/A"}
          </p>
        </div>
        <div className="col-span-4 flex items-center gap-2">
          <p className="font-semibold">Date/Time: </p>
          <p className="border-b border-black w-full">
            {initialData?.createdAt
              ? format(
                  new Date(initialData.createdAt),
                  "MMMM dd, yyyy - h:mm a"
                )
              : "N/A"}
          </p>
        </div>
      </div>
      <p className="font-bold text-md pl-2 w-full bg-[#839dbd]">
        Medical History
      </p>
      <table className="border-b text-left border-black">
        <thead className="border-black border-b">
          <tr className="border-black border-b">
            <th className="border-black border-r px-2 py-1">
              Illness/Diagnosis
            </th>
            <th className="border-black border-r px-2 py-1">Post Surgeries</th>
            <th className="border-black border-r px-2 py-1">
              Prescribed Medication
            </th>
            <th className="px-2 py-1">Dosage</th>
          </tr>
        </thead>
        <tbody>
          {initialData?.Medical.map((item) => (
            <tr key={item.id} className="border-b border-t border-black">
              <td className="border-black border-r px-2 py-1">
                {item?.illness || "N/A"}
              </td>
              <td className="border-black border-r px-2 py-1">
                {item?.postSurgeries || "N/A"}
              </td>
              <td className="border-black border-r px-2 py-1">
                {item?.medication || "N/A"}
              </td>
              <td className="px-2 py-1">{item?.dosage || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="font-bold text-md pl-2 w-full bg-[#839dbd]">
        Treatment History
      </p>
      <div className="grid-cols-10 grid w-full gap-3">
        <div className="col-span-5 border-r border-black">
          <table className="border-black text-left border-b w-full">
            <thead className="border-black border-b">
              <tr className="border-black border-b">
                <th className="px-2 py-1"></th>
                <th className="border-black border-r border-l px-2 py-1">
                  Date
                </th>
                <th className="border-black px-2 py-1">ABTC</th>
              </tr>
            </thead>
            <tbody>
              {initialData?.Treatment.map((item) => (
                <>
                  <tr key={item.id} className="border-b border-t border-black">
                    <td className="px-2 py-1">TT</td>
                    <td className="border-r border-black px-2 py-1 border-l">
                      {item.treatmentDate || "N/A"}
                    </td>
                    <td className="border-black px-2 py-1 border-l">
                      {item.tetanusToxoid || "N/A"}
                    </td>
                  </tr>
                  <tr key={item.id} className="border-b border-t border-black">
                    <td className="px-2 py-1">HTG</td>
                    <td className="border-r border-black px-2 py-1 border-l">
                      {item.treatmentDate || "N/A"}
                    </td>
                    <td className="border-black px-2 py-1 border-l">
                      {item.chickEmbryoCellVaccine || "N/A"}
                    </td>
                  </tr>
                  <tr key={item.id} className="border-b border-t border-black">
                    <td className="px-2 py-1">ATS</td>
                    <td className="border-black px-2 py-1 border-l">
                      {item.treatmentDate || "N/A"}
                    </td>
                    <td className="border-black px-2 py-1 border-l">
                      {item.antiRabiesSerum || "N/A"}
                    </td>
                  </tr>
                  <tr key={item.id} className="border-b border-t border-black">
                    <td className="px-2 py-1">ERIG</td>
                    <td className="border-r border-black px-2 py-1 border-l">
                      {item.treatmentDate || "N/A"}
                    </td>
                    <td className="border-black px-2 py-1 border-l">
                      {item.tetanusImmunuglobulin || "N/A"}
                    </td>
                  </tr>
                  <tr key={item.id} className="border-b border-t border-black">
                    <td className="px-2 py-1">HRIG</td>
                    <td className="border-r border-black px-2 py-1 border-l">
                      {item.treatmentDate || "N/A"}
                    </td>
                    <td className="border-black px-2 py-1 border-l">
                      {item.tetanusSerum || "N/A"}
                    </td>
                  </tr>
                  <tr key={item.id} className="border-b border-t border-black">
                    <td className="px-2 py-1">PCECV</td>
                    <td className="border-r border-black px-2 py-1 border-l">
                      {item.treatmentDate || "N/A"}
                    </td>
                    <td className="border-black px-2 py-1 border-l">
                      {item.verocellRabiesVaccine || "N/A"}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          <p className="font-bold text-md pl-2 w-full bg-[#839dbd]">
            Incident History
          </p>
          {initialData?.Incident.map((item) => (
            <>
              <div key={item.id} className="flex items-center gap-2 px-3 pt-1">
                <p className="font-semibold">NOI</p>
                <p className="border-b border-black w-full">
                  {item.natureOfIncident || "N/A"}
                </p>
              </div>
              <div key={item.id} className="flex items-center gap-2 px-3 pt-1">
                <p className="font-semibold">DOI</p>
                <p className="border-b border-black w-full">
                  {item.date || "N/A"}
                </p>
              </div>
              <div key={item.id} className="flex items-center gap-2 px-3 pt-1">
                <p className="font-semibold">POI</p>
                <p className="border-b border-black w-full">
                  {item.location || "N/A"}
                </p>
              </div>
              <div key={item.id} className="flex items-center gap-2 px-3 pt-1">
                <p className="font-semibold">SOB</p>
                <p className="border-b border-black w-full">
                  {item.siteOfBite || "N/A"}
                </p>
              </div>
              <div
                key={item.id}
                className="flex items-center gap-2 px-3 mb-2 pt-1"
              >
                <p className="font-semibold w-40">Bitting Animals</p>
                <p className="border-b border-black w-full">
                  {item.bittingAnimal || "N/A"}
                </p>
              </div>
            </>
          ))}
          <p className="font-bold text-md pl-2 w-full bg-[#839dbd]">
            Vital Signs
          </p>
          {initialData?.VitalSign.map((item) => (
            <>
              <div key={item.id} className="flex items-center gap-2 px-3 pt-1">
                <p className="font-semibold">BT</p>
                <p className="border-b border-black w-full">
                  {item.temperature || "N/A"} C
                </p>
              </div>
              <div key={item.id} className="flex items-center gap-2 px-3 pt-1">
                <p className="font-semibold w-24">B. Weight</p>
                <p className="border-b border-black w-full">
                  {item.weight || "N/A"} KG
                </p>
              </div>
              <div key={item.id} className="flex items-center gap-2 px-3 pt-1">
                <p className="font-semibold">RR</p>
                <p className="border-b border-black w-full">
                  {item.respiration || "N/A"}
                </p>
              </div>
              <div key={item.id} className="flex items-center gap-2 px-3 pt-1">
                <p className="font-semibold">PR</p>
                <p className="border-b border-black w-full">
                  {item.pulse || "N/A"}
                </p>
              </div>
              <div key={item.id} className="flex items-center gap-2 px-3 pt-1">
                <p className="font-semibold">BP</p>
                <p className="border-b border-black w-full">
                  {item.bloodPressure || "N/A"}
                </p>
              </div>
              <div key={item.id} className="flex items-center gap-2 px-3 pt-1">
                <p className="font-semibold">LI</p>
                <p className="border-b border-black w-full">
                  {item.lastIntake || "N/A"}
                </p>
              </div>
              <div
                key={item.id}
                className="flex items-center gap-2 px-3 mb-2 pt-1"
              >
                <p className="font-semibold">LO</p>
                <p className="border-b border-black w-full">
                  {item.lastOutput || "N/A"}
                </p>
              </div>
            </>
          ))}
        </div>
        <div className="col-span-5 flex items-center justify-center mx-auto flex-col relative w-full h-[500px]">
          {renderProfilingImage()}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div>
          <p className="font-bold text-md pl-2 w-full bg-[#839dbd]">
            Action/s Taken
          </p>
          <p className="px-2 py-2 border-r border-t border-b border-black">
            {initialData?.Incident?.[0]?.actionTaken || "No data available"}
          </p>
        </div>
        <div>
          <p className="font-bold text-md pl-2 w-full bg-[#839dbd]">
            Clinical Impression
          </p>
          <p className="px-2 py-2 border-r border-l border-t border-b border-black">
            {initialData?.Incident?.[0]?.clinicalImpression ||
              "No data available"}
          </p>
        </div>
        <div>
          <p className="font-bold text-md pl-2 w-full bg-[#839dbd]">
            Diagnosis (Category)
          </p>
          <p className="px-2 py-2 border-l border-t border-b border-black">
            {initialData?.Incident?.[0]?.category || "No data available"}
          </p>
        </div>
      </div>

      <p className="font-bold text-md pl-2 w-full bg-[#839dbd]">
        Vaccination Record
      </p>
      <div className="grid grid-cols-10 w-full gap-3">
        <div className="col-span-3 px-2 py-2">
          <p className="font-semibold">Tetanus</p>
          <div className="flex items-center gap-2 ml-5 mt-2">
            <p className="font-semibold">TT</p>
            <p className="border border-black px-2 py-3 w-full"></p>
          </div>
          <div className="flex items-center gap-2 ml-5 mt-2">
            <p className="font-semibold">HTIG</p>
            <p className="border border-black px-2 py-3 w-full"></p>
          </div>
          <div className="flex items-center gap-2 ml-5 mt-2">
            <p className="font-semibold">HRIG</p>
            <p className="border border-black px-2 py-3 w-full"></p>
          </div>
          <p className="font-semibold mt-3">ARS</p>
          <div className="flex items-center gap-2 ml-5 mt-2">
            <p className="font-semibold">ERIG</p>
            <p className="border border-black px-2 py-3 w-full"></p>
          </div>
          <div className="flex items-center gap-2 ml-5 mt-2">
            <p className="font-semibold">HRIG</p>
            <p className="border border-black px-2 py-3 w-full"></p>
          </div>
        </div>
        <div className="col-span-7 w-full pl-2 py-2">
          <p className="font-semibold mb-2">ARV</p>
          <table className="border-t border-b border-l text-left border-black w-full">
            <thead className="border-t border-b border-l border-black">
              <tr>
                <th></th>
                <th className="border-t border-b border-l border-black py-1 px-2">
                  Date
                </th>
                <th className="border-t border-b border-l border-black py-1 px-2">
                  Dose
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2">Day 0</td>
                <td className="border px-2 border-black">
                  {billingData.length > 0 && billingData[0].createdAt
                    ? format(
                        new Date(billingData[0].createdAt),
                        "MMMM do, yyyy"
                      )
                    : "N/A"}
                </td>
                <td className="border-l px-2 border-b border-black">
                  {billingData.length > 0 && billingData[0].service?.name
                    ? billingData[0].service.name
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-2">Day 3</td>
                <td className="border px-2 border-black">
                  {billingData.length > 0 && billingData[1].createdAt
                    ? format(
                        new Date(billingData[1].createdAt),
                        "MMMM do, yyyy"
                      )
                    : "N/A"}
                </td>
                <td className="border-l px-2 border-b border-black">
                  {billingData.length > 0 && billingData[1].service?.name
                    ? billingData[1].service.name
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-2">Day 7</td>
                <td className="border px-2 border-black">
                  {billingData.length > 0 && billingData[2].createdAt
                    ? format(
                        new Date(billingData[2].createdAt),
                        "MMMM do, yyyy"
                      )
                    : "N/A"}
                </td>
                <td className="border-l px-2 border-b border-black">
                  {billingData.length > 0 && billingData[2].service?.name
                    ? billingData[2].service.name
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-2">Day 21/28</td>
                <td className="border px-2 border-black">
                  {billingData.length > 0 && billingData[3].createdAt
                    ? format(
                        new Date(billingData[3].createdAt),
                        "MMMM do, yyyy"
                      )
                    : "N/A"}
                </td>
                <td className="border-l px-2 border-b border-black">
                  {billingData.length > 0 && billingData[3].service?.name
                    ? billingData[3].service.name
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientProfiling;
