"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type PatientColumn = {
  id: string;
  name: string;
  email: string;
  age: string;
  sex: string;
  address: string;
  adminBranch: string;
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
    header: "Email",
  },
  {
    accessorKey: "contact",
    header: "Contact Address",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "sex",
    header: "Sex",
  },
  {
    accessorKey: "address",
    header: "Address",
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
