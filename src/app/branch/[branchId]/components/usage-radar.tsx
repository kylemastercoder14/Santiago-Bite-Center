"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  {
    feature: "Appointment",
    mobile: 15,
    desktop: 110,
    max: 150,
  },
  {
    feature: "Browse",
    mobile: 130,
    desktop: 90,
    max: 150,
  },
  {
    feature: "Inquiries",
    mobile: 86,
    desktop: 130,
    max: 150,
  },
  {
    feature: "Trends",
    mobile: 125,
    desktop: 40,
    max: 150,
  },
  {
    feature: "Employees",
    mobile: 148,
    desktop: 90,
    max: 150,
  },
];

const UsageRadar = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Usage Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="h-64 px-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis className="text-xs font-bold" dataKey="feature" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
              <Radar
                name="Mobile"
                dataKey="mobile"
                stroke="#18181b"
                fill="#18181b"
                fillOpacity={0.2}
              />
              <Radar
                name="Desktop"
                dataKey="desktop"
                stroke="#a41c24"
                fill="#a41c24"
                fillOpacity={0.2}
              />
              <Tooltip
                wrapperClassName="text-sm rounded"
                labelClassName="text-xs text-stone-500"
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageRadar;
