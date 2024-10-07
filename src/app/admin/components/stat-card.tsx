import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

const StatCard = () => {
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
          <p className="text-2xl font-bold">{formatPrice(142564)}</p>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">From Jul 1st - Aug 31st</p>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardContent className="p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Total Appointments</p>
            <span className="text-xs flex items-center gap-1 font-medium px-2 py-1 rounded bg-red-100 text-red-700">
              <TrendingDown className="w-4 h-4 mr-2" />
              1.01%
            </span>
          </div>
          <p className="text-2xl font-bold">46</p>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">From Jul 1st - Aug 31st</p>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardContent className="p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Vaccine Inventory</p>
            <span className="text-xs flex items-center gap-1 font-medium px-2 py-1 rounded bg-green-100 text-green-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              5.23%
            </span>
          </div>
          <p className="text-2xl font-bold">189</p>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">From Jul 1st - Aug 31st</p>
        </CardContent>
      </Card>
    </>
  );
};

export default StatCard;
