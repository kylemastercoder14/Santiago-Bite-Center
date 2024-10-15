import { z } from "zod";

export const GeneralFormValidators = z.object({
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.string().min(1, { message: "Age is required." }),
  sex: z.string().min(1, { message: "Sex is required." }),
  civilStatus: z.string().min(1, { message: "Civil status is required." }),
  nextKin: z.string().min(1, { message: "Next of Kin is required." }),
  contactNumber: z.string().min(1, { message: "Contact number is required." }),
  homeAddress: z.string().min(1, { message: "Home address is required." }),
  region: z.string().min(1, { message: "Region is required." }),
  province: z.string().min(1, { message: "Province is required." }),
  municipality: z.string().min(1, { message: "Municipality is required." }),
  barangay: z.string().min(1, { message: "Barangay is required." }),
  branch: z.string().min(1, { message: "Branch is required." }),
});

export const MedicalFormValidators = z.object({
  illness: z.string().min(1, { message: "Illness is required." }),
  postSurgeries: z.string().min(1, { message: "Post surgeries is required." }),
  medication: z
    .string()
    .min(1, { message: "Prescribed medication is required." }),
  dosage: z.string().min(1, { message: "Dosage is required." }),
});

export const TreatmentFormValidators = z.object({
  treatmentDate: z.string().optional(),
  biteCenter: z.string().optional(),
  tetanusToxoid: z.string().optional(),
  tetanusImmunuglobulin: z.string().optional(),
  tetanusSerum: z.string().optional(),
  antiRabiesSerum: z.string().optional(),
  chickEmbryoCellVaccine: z.string().optional(),
  verocellRabiesVaccine: z.string().optional(),
});

export const VitalSignFormValidators = z.object({
  temperature: z.coerce
    .number()
    .min(1, { message: "Temperature is required." }),
  weight: z.coerce.number().min(1, { message: "Weight is required." }),
  pulse: z.coerce.number().min(1, { message: "Pulse is required." }),
  respiration: z.coerce
    .number()
    .min(1, { message: "Respiration is required." }),
  bloodPressure: z.coerce
    .string()
    .min(1, { message: "Blood pressure is required." }),
  lastIntake: z.string().min(1, { message: "Last intake is required." }),
  lastOutput: z.string().min(1, { message: "Last output is required." }),
});

export const IncidentSignFormValidators = z.object({
  natureOfIncident: z.coerce
    .string()
    .min(1, { message: "Nature of incident is required." }),
  dateIncident: z.string().min(1, { message: "Date of incident is required." }),
  placeOfIncident: z
    .string()
    .min(1, { message: "Place of incident is required." }),
  siteBite: z.string().min(1, { message: "Site of bite is required." }),
  bittingAnimal: z.string().min(1, { message: "Bitting animal is required." }),
  actionTaken: z.string().min(1, { message: "Action taken is required." }),
  clinicalImpression: z
    .string()
    .min(1, { message: "Clinical impression is required." }),
  category: z.string().min(1, { message: "Category is required." }),
});
