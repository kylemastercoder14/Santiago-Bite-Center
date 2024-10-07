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
import { VitalSignFormValidators } from "../validators";
import { useRouter } from "next/navigation";
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

const VitalSignCard = ({ vitalSign }: { vitalSign?: VitalSign }) => {
  const [pending, setIsPending] = useState(false);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const form = useForm<z.infer<typeof VitalSignFormValidators>>({
    resolver: zodResolver(VitalSignFormValidators),
    defaultValues: {
      temperature: vitalSign?.temperature ?? 0,
      weight: vitalSign?.weight ?? 0,
      pulse: vitalSign?.pulse ?? 0,
      respiration: vitalSign?.respiration ?? 0,
      bloodPressure: vitalSign?.bloodPressure ?? 0,
      lastIntake: vitalSign?.lastIntake ?? "",
      lastOutput: vitalSign?.lastOutput ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof VitalSignFormValidators>) => {
    setIsPending(true);
    try {
      await createVitalSign(values).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          router.push("/complete-registration/medical");
        }
      });
    } catch (error) {
      toast.error("Failed to create vital sign. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const onSelectDate = (date: Date | undefined, field: any) => {
    if (date) {
      field.onChange(format(date, DATE_DEFAULT_FORMAT));
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
                disabled={pending || !!vitalSign?.temperature}
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
                disabled={pending || !!vitalSign?.weight}
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
                disabled={pending || !!vitalSign?.pulse}
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
                disabled={pending || !!vitalSign?.respiration}
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
                disabled={pending || !!vitalSign?.bloodPressure}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Pressure</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Blood Pressure"
                        type="number"
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
              disabled={pending || !!vitalSign?.lastIntake}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Intake</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={pending || !!vitalSign?.lastIntake}
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
              disabled={pending || !!vitalSign?.lastOutput}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Output</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={pending || !!vitalSign?.lastOutput}
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
            <Button variant="destructive" disabled={pending || !!vitalSign} type="submit">
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
