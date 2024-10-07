import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet } from "lucide-react";
import Link from "next/link";
import React from "react";

const RecentTransactions = () => {
  return (
    <Card className="col-span-12 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          <Wallet className="w-4 h-4" /> Recent Transactions
        </h3>
        <Link href="/admin/dashboard/appointments" className="text-sm text-red-700 hover:underline">
          See all
        </Link>
      </div>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Kyle Andre Lim</TableCell>
              <TableCell>Pre and Post - Exposure Anti Rabies Vaccination</TableCell>
              <TableCell>September 11th, 2024 - 10:00 AM</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
