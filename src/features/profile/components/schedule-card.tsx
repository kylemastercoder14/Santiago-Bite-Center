"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";
import { generateTimeSlots } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar-schedule";
import { createAppointment } from "@/actions/appointment";

const ScheduleCard = ({ userId }: { userId: string }) => {
  const [pending, setIsPending] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(
    "8:00 AM"
  );
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    if (!date) {
      toast.error("Please select a valid date.");
      setIsPending(false);
      return;
    }

    try {
      const response = await createAppointment(
        userId,
        date.toISOString(), // Converting date to ISO string
        selectedTimeSlot || ""
      );

      if ("error" in response) {
        // TypeScript will infer if the response contains an 'error' field
        toast.error(response.error);
      } else {
        toast.success("Appointment scheduled successfully.");
        router.push("/");
      }
    } catch (error) {
      toast.error("Failed to create appointment. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const timeSlot = generateTimeSlots("08:00 AM", "17:00 PM", 60);

  const handleTimeSlotChange = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Appointment Schedule</CardTitle>
        <CardDescription>
          Please select your appointment schedule, choose only the available
          date and time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="flex items-start gap-5">
            <div>
              <Calendar
                mode="single"
                selected={date}
                className="rounded-md border shadow"
                onSelect={setDate}
              />
            </div>
            <Card>
              <CardContent className="p-5">
                <div className="grid grid-cols-5 gap-3">
                  {timeSlot.map((slot) => (
                    <div
                      key={slot.id}
                      className={`border shadow-sm px-3 py-2 rounded-lg cursor-pointer ${
                        selectedTimeSlot === slot.time
                          ? "bg-emerald-600 text-white"
                          : ""
                      }`}
                      onClick={() => handleTimeSlotChange(slot.time)}
                    >
                      <p className="text-sm">{slot.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Button variant="destructive" disabled={pending} type="submit">
            {pending && <LuLoader className="size-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;
