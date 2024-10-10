import React from "react";
import { format } from "date-fns";
import db from "@/lib/db";
import { EmployeeColumn } from "./components/column";
import EmployeeClient from "./components/client";

const Employees = async () => {
  const employees = await db.employee.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedEmployees: EmployeeColumn[] = employees.map((item) => ({
    id: item.id,
    name: item.firstName + " " + item.lastName,
    email: item.email,
    role: item.role,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EmployeeClient data={formattedEmployees} />
      </div>
    </div>
  );
};

export default Employees;
