import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import IncidentCard from "../../components/incident-card";

const Incident = () => {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="grid w-full gap-2">
        <h1 className="text-3xl font-semibold">Add New Patient Record</h1>
      </div>
      <div className="grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link href="/admin/dashboard/patient/new">General</Link>
          <Link href="/admin/dashboard/patient/new/vital-signs">
            Vital Signs
          </Link>
          <Link href="/admin/dashboard/patient/new/medical">Medical</Link>
          <Link
            href="/admin/dashboard/patient/new/incident"
            className="font-semibold text-primary"
          >
            Incident
          </Link>
          <Link href="/admin/dashboard/patient/new/treatment">Treatment</Link>
        </nav>
        <div className="grid gap-6">
          <IncidentCard />
        </div>
      </div>
    </main>
  );
};

export default Incident;
