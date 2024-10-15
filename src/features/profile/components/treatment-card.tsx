"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { TreatmentFormValidators } from "../validators";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";
import { Treatment } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/custom-calendar";
import {
  DATE_DEFAULT_FORMAT,
  DATE_DISPLAY_FORMAT,
  DATE_YEAR_MIN,
} from "@/lib/validators";
import { createTreatment } from "@/actions/patients";

const TreatmentCard = ({ treatment }: { treatment?: Treatment }) => {
  const [pending, setIsPending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof TreatmentFormValidators>>({
    resolver: zodResolver(TreatmentFormValidators),
    defaultValues: {
      treatmentDate: treatment?.treatmentDate || "",
      biteCenter: treatment?.biteCenter || "",
      tetanusToxoid: treatment?.tetanusToxoid || "",
      tetanusImmunuglobulin: treatment?.tetanusImmunuglobulin || "",
      tetanusSerum: treatment?.tetanusSerum || "",
      antiRabiesSerum: treatment?.antiRabiesSerum || "",
      chickEmbryoCellVaccine: treatment?.chickEmbryoCellVaccine || "",
      verocellRabiesVaccine: treatment?.verocellRabiesVaccine || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof TreatmentFormValidators>) => {
    setIsPending(true);
    try {
      await createTreatment(values).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          router.push("/complete-registration/schedule");
        }
      });
    } catch (error) {
      toast.error("Failed to create patient. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treatment History</CardTitle>
        <CardDescription>
          This information is essential for accurately managing your medical
          records and ensuring effective communication with healthcare
          providers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="treatmentDate"
              disabled={pending || !!treatment?.treatmentDate}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={pending || !!treatment?.treatmentDate}
                            className={cn(
                              "flex w-full hover:text-muted-foreground/90 text-muted-foreground border-input pl-2 justify-start font-normal focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed",
                              !field.value || "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-4 h-4 w-4" />
                            {field.value ? (
                              format(field.value, DATE_DISPLAY_FORMAT)
                            ) : (
                              <span>Select Treatment Date</span>
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
                          onSelect={(date = undefined) =>
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
              name="biteCenter"
              disabled={pending || !!treatment?.biteCenter}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Animal Bite Center Facility</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Bite Center Facility"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="tetanusToxoid"
                disabled={pending || !!treatment?.tetanusToxoid}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tetanus Toxoid</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Tetanus Toxoid" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tetanusImmunuglobulin"
                disabled={pending || !!treatment?.tetanusImmunuglobulin}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Human Tetanus Immunoglubolin</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Human Tetanus Immunoglubolin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tetanusSerum"
                disabled={pending || !!treatment?.tetanusSerum}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anti Tetanus Serum (ERIG/HRIG)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Anti Tetanus Serum (ERIG/HRIG)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="antiRabiesSerum"
                disabled={pending || !!treatment?.antiRabiesSerum}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anti Rabies Serum (ERIG/HRIG)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Anti Rabies Serum (ERIG/HRIG)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chickEmbryoCellVaccine"
                disabled={pending || !!treatment?.chickEmbryoCellVaccine}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purified Chick Embryo Cell Vaccine</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Purified Chick Embryo Cell Vaccine"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="verocellRabiesVaccine"
                disabled={pending || !!treatment?.verocellRabiesVaccine}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purified Verocell Rabies Vaccine</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Purified Verocell Rabies Vaccine"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button variant="destructive" disabled={pending || !!treatment} type="submit">
              {pending && <LuLoader className="size-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TreatmentCard;
