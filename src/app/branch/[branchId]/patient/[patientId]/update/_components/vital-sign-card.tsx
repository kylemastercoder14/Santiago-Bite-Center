"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";
import { createVitalSign } from "@/actions/patients";
import { useUser } from "@clerk/nextjs";
import { VitalSign } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import {
  DATE_DEFAULT_FORMAT,
  DATE_DISPLAY_FORMAT,
  DATE_YEAR_MIN,
} from "@/lib/validators";
import { Calendar } from "@/components/ui/custom-calendar";
import { VitalSignFormValidators } from "@/features/profile/validators";
import { PatientProps } from "../page";

const VitalSignCard = ({ initialData }: { initialData: PatientProps }) => {
  const params = useParams();
  const [pending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof VitalSignFormValidators>>({
    resolver: zodResolver(VitalSignFormValidators),
    defaultValues: {
      temperature: initialData?.vitalSign[0]?.temperature || 0,
      weight: initialData?.vitalSign[0]?.weight || 0,
      pulse: initialData?.vitalSign[0]?.pulse || 0,
      respiration: initialData?.vitalSign[0]?.respiration || 0,
      bloodPressure: initialData?.vitalSign[0]?.bloodPressure || "",
      lastIntake: initialData?.vitalSign[0]?.lastIntake || "",
      lastOutput: initialData?.vitalSign[0]?.lastOutput || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof VitalSignFormValidators>) => {
    setIsPending(true);
    try {
      await createVitalSign(values, 'walk-in').then((data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          toast.success("Data saved successfully.");
          router.push(`/branch/${params.branchId}/patient/new/medical`);
        }
      });
    } catch (error) {
      toast.error("Failed to create vital sign. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vital Signs Information</CardTitle>
        <CardDescription>
          This information is essential for accurately managing your medical
          records and ensuring effective communication with healthcare
          providers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="temperature"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Temperature"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Weight"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pulse"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pulse</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Pulse"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="respiration"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Respiration</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Respiration"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bloodPressure"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Pressure</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Blood Pressure (e.g: 120/80)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="lastIntake"
              disabled={pending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Intake</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={pending}
                            className={cn(
                              "flex w-full pl-2 hover:text-muted-foreground/90 border-input text-muted-foreground justify-start font-normal focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-4 h-4 w-4" />
                            {field.value ? (
                              format(field.value, DATE_DISPLAY_FORMAT)
                            ) : (
                              <span>Select Last Intake</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className=" w-auto p-0">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            date &&
                            field.onChange(format(date, DATE_DEFAULT_FORMAT))
                          }
                          fromYear={DATE_YEAR_MIN}
                          toYear={new Date().getFullYear()}
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastOutput"
              disabled={pending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Output</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={pending}
                            className={cn(
                              "flex w-full border-input hover:text-muted-foreground/90 text-muted-foreground pl-2 justify-start font-normal focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-4 h-4 w-4" />
                            {field.value ? (
                              format(field.value, DATE_DISPLAY_FORMAT)
                            ) : (
                              <span>Select Last Output</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className=" w-auto p-0">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            date &&
                            field.onChange(format(date, DATE_DEFAULT_FORMAT))
                          }
                          fromYear={DATE_YEAR_MIN}
                          toYear={new Date().getFullYear()}
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="destructive" disabled={pending} type="submit">
              {pending && <LuLoader className="size-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VitalSignCard;
