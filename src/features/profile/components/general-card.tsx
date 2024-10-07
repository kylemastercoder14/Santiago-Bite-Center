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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GeneralFormValidators } from "../validators";
import { useAddressData } from "@/lib/address-selection";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";
import { createPatient } from "@/actions/patients";
import { useUser } from "@clerk/nextjs";
import { Label } from "@/components/ui/label";
import { Patient } from "@prisma/client";

const GeneralCard = ({ patient }: { patient?: Patient }) => {
  const [pending, setIsPending] = useState(false);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const form = useForm<z.infer<typeof GeneralFormValidators>>({
    resolver: zodResolver(GeneralFormValidators),
    defaultValues: {
      age: patient?.age ?? "",
      sex: patient?.sex ?? "",
      civilStatus: patient?.civilStatus ?? "",
      nextKin: patient?.nextKin ?? "",
      contactNumber: patient?.contactNumber ?? "",
      homeAddress: "",
      region: "",
      province: "",
      municipality: "",
      barangay: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof GeneralFormValidators>) => {
    setIsPending(true);
    try {
      await createPatient(values).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          router.push("/complete-registration/vital-signs");
        }
      });
    } catch (error) {
      toast.error("Failed to create patient. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const selectedRegionName = form.watch("region");
  const selectedProvinceName = form.watch("province");
  const selectedMunicipalityName = form.watch("municipality");

  const {
    regionOptions,
    provinceOptions,
    municipalityOptions,
    barangayOptions,
  } = useAddressData(
    selectedRegionName,
    selectedProvinceName,
    selectedMunicipalityName
  );

  if (!isLoaded) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
        <CardDescription>
          This information is essential for accurately managing your medical
          records and ensuring effective communication with healthcare
          providers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="Enter Full Name"
                disabled
                defaultValue={user?.fullName as string}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Make sure to add a complete name eg. Juan Dela Cruz Jr.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="age"
                disabled={pending || !!patient?.age}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Age" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                disabled={pending || !!patient?.sex}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={pending || !!patient?.sex}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="civilStatus"
                disabled={pending || !!patient?.civilStatus}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Civil Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={pending || !!patient?.civilStatus}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Civil Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Separated">Separated</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="contactNumber"
              disabled={pending || !!patient?.contactNumber}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Contact Number"
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
              name="nextKin"
              disabled={pending || !!patient?.nextKin}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next of Kin</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Next of Kin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {patient?.address === undefined && (
              <FormField
                control={form.control}
                name="homeAddress"
                disabled={pending || !!patient?.address}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      House/Unit/Block No., Street, Subdivision/Village
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter House/Unit/Block No., Street, Subdivision/Village"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {patient?.address ? (
              <div>
                <Label>Address</Label>
                <Input disabled defaultValue={patient.address as string} />
              </div>
            ) : (
              <div className="grid grid-cols-4 mb-3 gap-2">
                <FormField
                  control={form.control}
                  name="region"
                  disabled={pending || !!patient?.address}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={pending || !!patient?.address}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regionOptions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="province"
                  disabled={pending || !!patient?.address}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={pending || !!patient?.address}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinceOptions.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="municipality"
                  disabled={pending || !!patient?.address}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Municipality</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={pending || !!patient?.address}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Municipality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {municipalityOptions.map((municipality) => (
                            <SelectItem key={municipality} value={municipality}>
                              {municipality}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="barangay"
                  disabled={pending || !!patient?.address}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barangay</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={pending || !!patient?.address}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Barangay" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {barangayOptions.map((barangay) => (
                            <SelectItem key={barangay} value={barangay}>
                              {barangay}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <Button variant="destructive" disabled={pending || !!patient} type="submit">
              {pending && <LuLoader className="size-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GeneralCard;
