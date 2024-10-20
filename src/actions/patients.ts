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

    // Fetch patient based on the user type
    const existingPatient = await db.patient.findFirst({
      where: { userId: existingUser.id },
    });

    const existingPatientWalkIn = await db.patient.findFirst({
      orderBy: { createdAt: "desc" },
    });

    // Ensure a valid patient record exists
    const patientToConnect =
      type === "walk-in" ? existingPatientWalkIn : existingPatient;

    if (!patientToConnect || !patientToConnect.id) {
      return {
        error: `Failed to find a valid patient for ${
          type === "walk-in" ? "walk-in" : "registered user"
        }.`,
      };
    }

    for (const history of medicalHistories) {
      // Check for existing records with the same details for the user
      const existingRecord = await db.medical.findFirst({
        where: {
          illness: history.illness,
          postSurgeries: history.postSurgeries,
          medication: history.medication,
          dosage: history.dosage,
          userId: patientToConnect.userId,
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
            userId: patientToConnect.userId,
            patients: {
              connect: { id: patientToConnect.id }, // Connect to the valid patient
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

  // Validate form fields
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

  // Fetch patient based on the user type
  const existingPatient = await db.patient.findFirst({
    where: { userId: existingUser.id },
  });

  const existingPatientWalkIn = await db.patient.findFirst({
    orderBy: { createdAt: "desc" },
  });

  // Ensure a valid patient record exists
  const patientToConnect =
    type === "walk-in" ? existingPatientWalkIn : existingPatient;

  if (!patientToConnect || !patientToConnect.id) {
    return {
      error: `Failed to find a valid patient for ${
        type === "walk-in" ? "walk-in" : "registered user"
      }.`,
    };
  }

  try {
    // Create the treatment record
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
        userId: patientToConnect.userId, // Use the valid userId
        patient: { connect: { id: patientToConnect.id } }, // Connect to the valid patient
      },
    });

    return {
      success: "Treatment history created successfully",
      userId: patientToConnect.userId,
    };
  } catch (error: any) {
    return {
      error: `Failed to create treatment history. Please try again. ${error.message || ""}`,
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

  // Ensure authenticated user exists
  const existingUser = await getUserById(user?.id as string);
  if (!existingUser) {
    return { error: "Unauthenticated" };
  }

  // Fetch existing patient for the authenticated user
  const existingPatient = await db.patient.findFirst({
    where: { userId: existingUser.id },
  });

  // Fetch the latest walk-in patient
  const existingPatientWalkIn = await db.patient.findFirst({
    orderBy: { createdAt: "desc" },
  });

  // Ensure patient exists based on type (walk-in or registered user)
  const patientToConnect =
    type === "walk-in" ? existingPatientWalkIn : existingPatient;

  if (!patientToConnect || !patientToConnect.id) {
    return {
      error: `Failed to find a valid patient for ${type === "walk-in" ? "walk-in" : "registered user"}.`,
    };
  }

  try {
    // Create vitalSign record and connect the patient
    await db.vitalSign.create({
      data: {
        temperature,
        weight,
        pulse,
        respiration,
        bloodPressure,
        lastIntake,
        lastOutput,
        userId: patientToConnect.userId, // User ID must come from the patient
        Patient: { connect: { id: patientToConnect.id } }, // Connect valid patient
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

  // Validate input fields
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

  if (!existingUser) {
    return { error: "Unauthenticated" };
  }

  // Fetch patient based on the user type
  const existingPatient = await db.patient.findFirst({
    where: { userId: existingUser.id },
  });

  const existingPatientWalkIn = await db.patient.findFirst({
    orderBy: { createdAt: "desc" },
  });

  // Ensure a valid patient record exists
  const patientToConnect =
    type === "walk-in" ? existingPatientWalkIn : existingPatient;

  if (!patientToConnect || !patientToConnect.id) {
    return {
      error: `Failed to find a valid patient for ${
        type === "walk-in" ? "walk-in" : "registered user"
      }.`,
    };
  }

  try {
    // Create the incident
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
        userId: patientToConnect.userId,
        patient: { connect: { id: patientToConnect.id } }, // Connect to the valid patient
      },
    });
    return { success: "Incident created successfully" };
  } catch (error: any) {
    return {
      error: `Failed to create incident. Please try again. ${error.message || ""}`,
    };
  }
};

export const deletePatient = async (patientId: string) => {
  if (!patientId) {
    return { error: "Patient ID is required" };
  }

  try {
    // Check if the patient exists first
    const existingPatient = await db.patient.findUnique({
      where: { id: patientId },
    });

    if (!existingPatient) {
      return { error: "Patient does not exist" };
    }

    // Proceed to delete the patient
    const patient = await db.patient.delete({
      where: { id: patientId },
    });

    await db.user.delete({
      where: { id: patient.userId },
    });

    // Continue deleting associated records
    await db.vitalSign.deleteMany({
      where: { userId: patient.userId },
    });

    await db.medical.deleteMany({
      where: { userId: patient.userId },
    });

    await db.incident.deleteMany({
      where: { userId: patient.userId },
    });

    await db.treatment.deleteMany({
      where: { userId: patient.userId },
    });

    await db.appointment.deleteMany({
      where: { userId: patient.userId },
    });

    await db.billing.deleteMany({
      where: {
        userId: patient.userId,
      },
    });

    await db.billingItem.deleteMany({
      where: {
        billing: {
          userId: patient.userId,
        },
      },
    });

    return { success: "Patient deleted successfully" };
  } catch (error: any) {
    return {
      error: `Failed to delete patient. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
