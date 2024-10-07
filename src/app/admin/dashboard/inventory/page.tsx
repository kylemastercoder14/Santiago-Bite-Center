import React from "react";
import { format } from "date-fns";
import db from "@/lib/db";
import { InventoryColumn } from "./components/column";
import InventoryClient from "./components/client";

const Inventory = async () => {
  const inventory = await db.inventory.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedInventory: InventoryColumn[] = inventory.map((item) => ({
    id: item.id,
    name: item.name,
    stocks: item.stocks ?? 0,
    consumed: item.consumed ?? 0,
    buffer: item.buffer,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InventoryClient data={formattedInventory} />
      </div>
    </div>
  );
};

export default Inventory;
