"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type EmployeeColumn = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export const columns: ColumnDef<EmployeeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Position",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
];
