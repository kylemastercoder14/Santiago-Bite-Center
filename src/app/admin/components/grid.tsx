import React from "react";
import StatCard from "./stat-card";
import ReportTable from "./report-table";

const Grid = () => {
  return (
    <div className="px-4 grid gap-3 grid-cols-12">
      <StatCard />
      <ReportTable />
    </div>
  );
};

export default Grid;
