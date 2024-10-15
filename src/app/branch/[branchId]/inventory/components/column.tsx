"use client";

import { ColumnDef } from "@tanstack/react-table";

export type InventoryColumn = {
  id: string;
  name: string;
  stocks: number;
  consumed: number;
  buffer: number;
  createdAt: string;
};

export const columns: ColumnDef<InventoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Vaccine",
  },
  {
    accessorKey: "stocks",
    header: "Stocks",
  },
  {
    accessorKey: "consumed",
    header: "Consumed",
  },
  {
    accessorKey: "buffer",
    header: "Buffer",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
];
