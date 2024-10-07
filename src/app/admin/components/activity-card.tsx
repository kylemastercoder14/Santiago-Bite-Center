"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartNoAxesCombined } from "lucide-react";
import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";

const data = [
  {
    name: "Jan",
    Pending: 275,
    Success: 41,
  },
  {
    name: "Feb",
    Pending: 620,
    Success: 96,
  },
  {
    name: "Mar",
    Pending: 202,
    Success: 192,
  },
  {
    name: "Apr",
    Pending: 500,
    Success: 50,
  },
  {
    name: "May",
    Pending: 355,
    Success: 400,
  },
  {
    name: "Jun",
    Pending: 875,
    Success: 200,
  },
  {
    name: "Jul",
    Pending: 700,
    Success: 205,
  },
];

const ActivityCard = () => {
  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ChartNoAxesCombined className="w-4 h-4 mr-2" />
          Monthly Appointments Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="h-64 px-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={400}
              data={data}
              margin={{ top: 0, right: 0, left: -24, bottom: 0 }}
            >
              <CartesianGrid stroke="#e4e4e7" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                className="text-xs font-bold"
                padding={{ right: 4 }}
              />
              <YAxis
                className="text-xs font-bold"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                wrapperClassName="text-sm rounded"
                labelClassName="text-xs text-stone-500"
              />
              <Line
                type="monotone"
                dataKey="Success"
                stroke="#18181b"
                fill="#18181b"
              />
              <Line
                type="monotone"
                dataKey="Pending"
                stroke="#a41c24"
                fill="#a41c24"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
