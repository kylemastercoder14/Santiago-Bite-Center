import EmployeeForm from "@/components/forms/employee-form";
import db from "@/lib/db";
import React from "react";

const EmployeePage = async ({ params }: { params: { employeeId: string } }) => {
  const employee = await db.employee.findUnique({
    where: {
      id: params.employeeId,
    },
  });

  const branch = await db.branch.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EmployeeForm initialData={employee} branch={branch} />
      </div>
    </div>
  );
};

export default EmployeePage;
