import React from "react";
import Link from "next/link";
import GeneralCard from "@/features/profile/components/general-card";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const CompleteRegistration = async () => {
  const user = await currentUser();
  let userData = null;
  if (user) {
    userData = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });
  }

  const patientData = await db.patient.findFirst({
    where: {
      userId: userData?.id,
    },
  });

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Complete Profile</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link
            href="/complete-registration"
            className="font-semibold text-primary"
          >
            General
          </Link>
          <Link href="/complete-registration/vital-signs">Vital Signs</Link>
          <Link href="/complete-registration/medical">Medical</Link>
          <Link href="/complete-registration/treatment">Treatment</Link>
          <Link href="/complete-registration/schedule">Schedule</Link>
        </nav>
        <div className="grid gap-6">
          {patientData ? <GeneralCard patient={patientData} /> : <GeneralCard />}
        </div>
      </div>
    </main>
  );
};

export default CompleteRegistration;
