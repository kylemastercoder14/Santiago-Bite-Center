"use client";

import React, { useEffect, useState } from "react";
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
import { useAddressData } from "@/lib/address-selection";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";
import { createPatient } from "@/actions/patients";
import { useUser } from "@clerk/nextjs";
import { Branch, Patient } from "@prisma/client";
import { getAllBranches } from "@/actions/branch";
import { GeneralFormValidators } from "@/features/profile/validators";
import { createWalkInPatient } from "@/actions/user";
import { PatientProps } from "../page";
import { parseAddress } from "@/lib/utils";

const GeneralCard = ({ initialData }: { initialData: PatientProps }) => {
  const params = useParams();
  const addressComponents = parseAddress(initialData.address ?? "");
  const [branch, setBranch] = useState<Branch[]>([]);
  const [pending, setIsPending] = useState(false);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const form = useForm<z.infer<typeof GeneralFormValidators>>({
    resolver: zodResolver(GeneralFormValidators),
    defaultValues: {
      email: initialData?.user?.email,
      firstName: initialData?.user?.firstName ?? "",
      lastName: initialData?.user?.lastName ?? "",
      age: initialData?.age ?? "",
      sex: initialData?.sex ?? "",
      civilStatus: initialData?.civilStatus ?? "",
      nextKin: initialData?.nextKin ?? "",
      contactNumber: initialData?.contactNumber ?? "",
      homeAddress: addressComponents?.houseNumber ?? "",
      region: addressComponents?.region ?? "",
      province: addressComponents?.province ?? "",
      municipality: addressComponents?.municipality ?? "",
      barangay: addressComponents?.barangay ?? "",
      branch: "",
    },
  });

  useEffect(() => {
    const fetchBranch = async () => {
      const response = await getAllBranches();
      setBranch(response);
    };
    fetchBranch();
  }, []);

  const onSubmit = async (values: z.infer<typeof GeneralFormValidators>) => {
    setIsPending(true);
    if (!values.email || !values.firstName || !values.lastName) {
      toast.error("All fields are required.");
      setIsPending(false);
      return;
    }
    try {
      const response = await createWalkInPatient(
        values.email ?? "",
        values.lastName ?? "",
        values.firstName ?? ""
      );
      await createPatient(values, response.userId).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          router.push(`/branch/${params.branchId}/patient/new/vital-signs`);
          toast.success("Data saved successfully.");
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
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="firstName"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              disabled={pending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="age"
                disabled={pending}
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
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={pending}
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
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Civil Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={pending}
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
              disabled={pending}
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
              disabled={pending}
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
            <FormField
              control={form.control}
              name="homeAddress"
              disabled={pending}
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
            <div className="grid grid-cols-4 mb-3 gap-2">
              <FormField
                control={form.control}
                name="region"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={pending}
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
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={pending}
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
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipality</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={pending}
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
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barangay</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={pending}
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
            <FormField
              control={form.control}
              name="branch"
              disabled={pending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={pending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branch?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default GeneralCard;
