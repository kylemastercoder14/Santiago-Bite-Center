import React from "react";
import StatCard from "./stat-card";
import ActivityCard from "./activity-card";
import UsageRadar from "./usage-radar";
import RecentTransaction from "./recent-transaction";

const Grid = () => {
  return (
    <div className="px-4 grid gap-3 grid-cols-12">
      <StatCard />
      <ActivityCard />
      <UsageRadar />
      {/* <RecentTransaction /> */}
    </div>
  );
};

export default Grid;
