"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type PatientColumn = {
  id: string;
  name: string;
  email: string;
  patientId: string;
  age: string;
  sex: string;
  branchId: string;
  adminBranch: string;
  address: string;
  contact: string;
  createdAt: string;
};

export const columns: ColumnDef<PatientColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Nature of Incident",
  },
  {
    accessorKey: "contact",
    header: "Site of Incident",
  },
  {
    accessorKey: "sex",
    header: "Date of Incident",
  },
  {
    accessorKey: "address",
    header: "Category",
  },
  {
    accessorKey: "adminBranch",
    header: "Branch",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
