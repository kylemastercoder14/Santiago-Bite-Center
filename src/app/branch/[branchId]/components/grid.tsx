"use client";

import React from "react";
import StatCard from "./stat-card";
import ActivityCard from "./activity-card";
import UsageRadar from "./usage-radar";
import { useParams } from "next/navigation";

const Grid = () => {
  return (
    <div className="px-4 grid gap-3 grid-cols-12">
      {/* <StatCard /> */}
      <ActivityCard />
      <UsageRadar />
      {/* <RecentTransaction /> */}
    </div>
  );
};

export default Grid;
