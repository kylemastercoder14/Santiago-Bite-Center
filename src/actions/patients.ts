"use server";

import { getUserById } from "@/app/hooks/get-user-by-id";
import {
  GeneralFormValidators,
  IncidentSignFormValidators,
  MedicalFormValidators,
  TreatmentFormValidators,
  VitalSignFormValidators,
} from "@/features/profile/validators";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

export const createPatient = async (
  values: z.infer<typeof GeneralFormValidators>,
  type?: string
) => {
  const user = await currentUser();

  const validatedField = GeneralFormValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    age,
    sex,
    civilStatus,
    nextKin,
    contactNumber,
    homeAddress,
    region,
    province,
    municipality,
    barangay,
    branch,
  } = validatedField.data;

  const address = `${homeAddress}, ${barangay}, ${municipality}, ${province}, ${region}`;

  const existingUser = await getUserById(user?.id as string);

  if (!existingUser) {
    return { error: "Unauthenticated" };
  }

  try {
    await db.patient.create({
      data: {
        age,
        sex,
        civilStatus,
        nextKin,
        contactNumber,
        address,
        userId: type ? type : existingUser.id,
        branchId: branch,
      },
    });
    return { success: "Patient created successfully" };
  } catch (error: any) {
    return {
      error: `Failed to create employee. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const createMedicalHistory = async (
  medicalHistories: {
    illness: string;
    postSurgeries: string;
    medication: string;
    dosage: string;
  }[],
  type?: string
) => {
  try {
    const user = await currentUser();

    const existingUser = await getUserById(user?.id as string);

    if (!existingUser) {
      return { error: "Unauthenticated" };
    }

    const existingPatient = await db.patient.findFirst({
      where: { userId: existingUser.id },
    });

    const existingPatientWalkIn = await db.patient.findFirst({
      orderBy: { createdAt: "desc" },
    });

    for (const history of medicalHistories) {
      // Check for existing records with the same details for the user
      const existingRecord = await db.medical.findFirst({
        where: {
          illness: history.illness,
          postSurgeries: history.postSurgeries,
          medication: history.medication,
          dosage: history.dosage,
          userId:
            type === "walk-in"
              ? existingPatientWalkIn?.userId ?? ""
              : existingUser.id ?? "",
        },
      });

      if (existingRecord) {
        // If record exists, update it
        await db.medical.update({
          where: { id: existingRecord.id },
          data: {
            illness: history.illness,
            postSurgeries: history.postSurgeries,
            medication: history.medication,
            dosage: history.dosage,
          },
        });
      } else {
        // If record does not exist, create a new one
        await db.medical.create({
          data: {
            illness: history.illness,
            postSurgeries: history.postSurgeries,
            medication: history.medication,
            dosage: history.dosage,
            userId:
              type === "walk-in"
                ? existingPatientWalkIn?.userId ?? ""
                : existingUser.id ?? "",
            patients: {
              connect: { id: existingPatient?.id },
            },
          },
        });
      }
    }

    return { success: "Medical history created successfully." };
  } catch (error: any) {
    return {
      error: `Failed to create or update medical histories. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const createTreatment = async (
  values: z.infer<typeof TreatmentFormValidators>,
  type?: string
) => {
  const user = await currentUser();

  const validatedField = TreatmentFormValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    treatmentDate,
    biteCenter,
    tetanusToxoid,
    tetanusImmunuglobulin,
    tetanusSerum,
    antiRabiesSerum,
    chickEmbryoCellVaccine,
    verocellRabiesVaccine,
  } = validatedField.data;

  const existingUser = await getUserById(user?.id as string);

  if (!existingUser) {
    return { error: "Unauthenticated" };
  }

  const existingPatient = await db.patient.findFirst({
    where: { userId: existingUser.id },
  });

  const existingPatientWalkIn = await db.patient.findFirst({
    orderBy: { createdAt: "desc" },
  });

  try {
    await db.treatment.create({
      data: {
        treatmentDate,
        biteCenter,
        tetanusToxoid,
        tetanusImmunuglobulin,
        tetanusSerum,
        antiRabiesSerum,
        chickEmbryoCellVaccine,
        verocellRabiesVaccine,
        userId:
          type === "walk-in"
            ? existingPatientWalkIn?.userId ?? ""
            : existingUser.id ?? "",
        patient: { connect: { id: existingPatient?.id } },
      },
    });

    const userId = type === "walk-in" ? existingPatientWalkIn?.userId : existingUser.id;
    return { success: "Treatment history created successfully", userId };
  } catch (error: any) {
    return {
      error: `Failed to create treatment history. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const createVitalSign = async (
  values: z.infer<typeof VitalSignFormValidators>,
  type?: string
) => {
  const user = await currentUser();

  const validatedField = VitalSignFormValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    temperature,
    weight,
    pulse,
    respiration,
    bloodPressure,
    lastIntake,
    lastOutput,
  } = validatedField.data;

  const existingUser = await getUserById(user?.id as string);

  const existingPatientWalkIn = await db.patient.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!existingUser) {
    return { error: "Unauthenticated" };
  }

  const existingPatient = await db.patient.findFirst({
    where: { userId: existingUser.id },
  });

  try {
    await db.vitalSign.create({
      data: {
        temperature,
        weight,
        pulse,
        respiration,
        bloodPressure,
        lastIntake,
        lastOutput,
        userId:
          type === "walk-in"
            ? existingPatientWalkIn?.userId ?? ""
            : existingUser.id ?? "",
        Patient: { connect: { id: existingPatient?.id ?? "" } },
      },
    });
    return { success: "Vital sign created successfully" };
  } catch (error: any) {
    return {
      error: `Failed to create vital sign. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const createIncident = async (
  values: z.infer<typeof IncidentSignFormValidators>,
  type?: string
) => {
  const user = await currentUser();

  const validatedField = IncidentSignFormValidators.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    natureOfIncident,
    dateIncident,
    placeOfIncident,
    siteBite,
    bittingAnimal,
    actionTaken,
    clinicalImpression,
    category,
  } = validatedField.data;

  const existingUser = await getUserById(user?.id as string);

  const existingPatientWalkIn = await db.patient.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!existingUser) {
    return { error: "Unauthenticated" };
  }

  const existingPatient = await db.patient.findFirst({
    where: { userId: existingUser.id },
  });

  try {
    await db.incident.create({
      data: {
        natureOfIncident,
        date: dateIncident,
        location: placeOfIncident,
        siteOfBite: siteBite,
        bittingAnimal,
        actionTaken,
        clinicalImpression,
        category,
        userId:
          type === "walk-in"
            ? existingPatientWalkIn?.userId ?? ""
            : existingUser.id ?? "",
        patient: { connect: { id: existingPatient?.id } },
      },
    });
    return { success: "incident created successfully" };
  } catch (error: any) {
    return {
      error: `Failed to create incident. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
