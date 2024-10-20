import React from "react";
import { format } from "date-fns";
import db from "@/lib/db";
import { HistoryColumn } from "./components/column";
import HistoryClient from "./components/client";

const History = async ({ params }: { params: { branchId: string } }) => {
  const history = await db.billingItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
        billing: {include: {user: true}},
        service: true
    }
  });

  const formattedHistory: HistoryColumn[] = history.map((item) => ({
    id: item.id,
    name: item.billing.user.firstName + " " + item.billing.user.lastName,
    service: item.service.name,
    status: item.status,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HistoryClient data={formattedHistory} />
      </div>
    </div>
  );
};

export default History;
