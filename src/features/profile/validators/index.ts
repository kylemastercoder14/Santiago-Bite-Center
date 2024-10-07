import { z } from "zod";

export const GeneralFormValidators = z.object({
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
  treatmentDate: z.string().min(1, { message: "Treatment date is required." }),
  biteCenter: z.string().min(1, { message: "Bite center is required." }),
  tetanusToxoid: z.string().min(1, { message: "Tetanus toxoid is required." }),
  tetanusImmunuglobulin: z
    .string()
    .min(1, { message: "Tetanus immunuglobulin is required." }),
  tetanusSerum: z.string().min(1, { message: "Tetanus serum is required." }),
  antiRabiesSerum: z
    .string()
    .min(1, { message: "Anti rabies serum is required." }),
  chickEmbryoCellVaccine: z
    .string()
    .min(1, { message: "Chick embryo cell vaccine is required." }),
  verocellRabiesVaccine: z
    .string()
    .min(1, { message: "Verocell rabies vaccine is required." }),
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
    .number()
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
