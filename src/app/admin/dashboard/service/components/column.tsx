"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ServiceColumn = {
  id: string;
  name: string;
  description: string;
  price: any;
  createdAt: string;
};

export const columns: ColumnDef<ServiceColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description;
      const maxLength = 130; // Set your desired max length
      const shortenedDescription =
        description.length > maxLength
          ? `${description.slice(0, maxLength)}...`
          : description;

      return <span>{shortenedDescription}</span>;
    },
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
