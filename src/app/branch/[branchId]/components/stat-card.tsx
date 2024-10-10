import { Card, CardContent } from "@/components/ui/card";
import db from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

const StatCard = async () => {
  const startDate = new Date("2024-10-01");
  const endDate = new Date("2024-11-01");
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of the day (00:00:00)

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Move to the next day
  tomorrow.setHours(0, 0, 0, 0); // Start of tomorrow (00:00:00)
  const services = await db.service.findMany({
    where: {
      billingItem: {
        some: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    },
    include: {
      billingItem: true,
    },
  });

  const patients = await db.patient.findMany({
    where: {
      createdAt: {
        gte: today, // Greater than or equal to today's start
        lt: tomorrow, // Less than tomorrow's start (end of today)
      },
    },
  });

  const totalStock = await db.inventory.aggregate({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      stocks: true,
    },
  });

  const grossRevenue = services.reduce((total, service) => {
    const isBilled = service.billingItem.some(
      (billingItem) => billingItem.status === "Completed"
    );
    return isBilled ? total + service.price : total;
  }, 0);

  return (
    <>
      <Card className="col-span-4">
        <CardContent className="p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Gross Revenue</p>
            <span className="text-xs flex items-center gap-1 font-medium px-2 py-1 rounded bg-green-100 text-green-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              2.75%
            </span>
          </div>
          <p className="text-2xl font-bold">{formatPrice(grossRevenue)}</p>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">
            From Oct 1st - Nov 1st
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardContent className="p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Total Patients</p>
          </div>
          <p className="text-2xl font-bold">{patients.length}</p>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">
            {today.toDateString()} - {tomorrow.toDateString()}
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardContent className="p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Available Vaccine</p>
            <span className="text-xs flex items-center gap-1 font-medium px-2 py-1 rounded bg-green-100 text-green-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              5.23%
            </span>
          </div>
          <p className="text-2xl font-bold">{totalStock._sum.stocks || 0}</p>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">
            From Oct 1st - Nov 1st
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default StatCard;
