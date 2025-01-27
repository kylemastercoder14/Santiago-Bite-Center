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
import { IncidentSignFormValidators } from "../validators";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";
import { createIncident, createVitalSign } from "@/actions/patients";
import { useUser } from "@clerk/nextjs";
import { Incident, VitalSign } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const IncidentCard = ({ incident }: { incident?: Incident }) => {
  const [pending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof IncidentSignFormValidators>>({
    resolver: zodResolver(IncidentSignFormValidators),
    defaultValues: {
      natureOfIncident: incident?.natureOfIncident ?? "",
      dateIncident: incident?.date ?? "",
      placeOfIncident: incident?.location ?? "",
      siteBite: incident?.siteOfBite ?? "",
      bittingAnimal: incident?.bittingAnimal ?? "",
      actionTaken: incident?.actionTaken ?? "",
      clinicalImpression: incident?.clinicalImpression ?? "",
      category: incident?.category ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof IncidentSignFormValidators>
  ) => {
    setIsPending(true);
    try {
      await createIncident(values).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          router.push("/complete-registration/treatment");
        }
      });
    } catch (error) {
      toast.error("Failed to create incident. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last Incident Information</CardTitle>
        <CardDescription>
          This information is essential for accurately managing your incident
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
                name="natureOfIncident"
                disabled={pending || !!incident?.natureOfIncident}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nature of Incident</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Nature of Incident"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateIncident"
                disabled={pending || !!incident?.date}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Incident</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              disabled={pending || !!incident?.date}
                              className={cn(
                                "flex w-full pl-2 hover:text-muted-foreground/90 border-input text-muted-foreground justify-start font-normal focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-4 h-4 w-4" />
                              {field.value ? (
                                format(field.value, DATE_DISPLAY_FORMAT)
                              ) : (
                                <span>Select Date of Incident</span>
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
                name="placeOfIncident"
                disabled={pending || !!incident?.location}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of Incident</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Place of Incident"
                        type="text"
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
              name="siteBite"
              disabled={pending || !!incident?.siteOfBite}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site of Bite</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Site of Bite"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bittingAnimal"
              disabled={pending || !!incident?.bittingAnimal}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bitting Animal</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Bitting Animal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Alive">Alive</SelectItem>
                        <SelectItem value="Dead">Dead</SelectItem>
                        <SelectItem value="Killed">Killed</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="actionTaken"
                disabled={pending || !!incident?.actionTaken}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action Taken</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Action Taken"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clinicalImpression"
                disabled={pending || !!incident?.clinicalImpression}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinical Impression</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Clinical Impression"
                        type="text"
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
              name="category"
              disabled={pending || !!incident?.category}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Category"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="destructive"
              disabled={pending || !!incident}
              type="submit"
            >
              {pending && <LuLoader className="size-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default IncidentCard;
