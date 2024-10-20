"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type HistoryColumn = {
  id: string;
  name: string;
  service: string;
  status: string;
  createdAt: string;
};

export const columns: ColumnDef<HistoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant={row.original.status === "Pending" ? "destructive" : "success"}>{row.original.status}</Badge>,
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
];
