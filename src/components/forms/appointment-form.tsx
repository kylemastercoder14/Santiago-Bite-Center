"use client";

import {
  Billing,
  BillingItem,
  Inventory,
  Appointment as PrismaAppointment,
  Service,
  User,
} from "@prisma/client";
import React, { useEffect, useState } from "react";
import { Heading } from "../ui/heading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppointmentFormSchema } from "@/lib/validators";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import CustomFormField, { FormFieldType } from "../custom-formfield";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "../ui/table";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { createBillingAppointment } from "@/actions/appointment";
import { useParams, useRouter } from "next/navigation";

type Appointment = PrismaAppointment & {
  forInsurance?: boolean;
  forAics?: boolean;
};

const AppointmentForm = ({
  initialData,
  userData,
  services,
  billing,
  billingItems,
  vaccinations,
  site,
}: {
  initialData: Appointment | null;
  userData: User | null;
  services: Service[];
  vaccinations: Inventory[];
  billing: Billing | null;
  billingItems: BillingItem[];
  site: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [appointmentId, setAppointmentId] = useState(initialData?.id ?? "");
  const [userId, setUserId] = useState(initialData?.userId ?? "");
  const [selectedServices, setSelectedServices] = useState<
    { service: Service | null; price: number | null; date: string | null }[]
  >([{ service: null, price: null, date: null }]);
  const [selectedVaccination, setSelectedVaccination] = useState<
    {
      vaccination: Inventory | null;
      date: string | null;
      quantity: number | null;
    }[]
  >([{ vaccination: null, date: null, quantity: 1 }]);
  const fullName = userData?.firstName + " " + userData?.lastName;
  const form = useForm<z.infer<typeof AppointmentFormSchema>>({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      name: fullName ?? "",
      forInsurance: String(billing?.forInsurance ?? false),
      forAics: String(billing?.forAics ?? false),
      userCategory: billing?.userCategory ?? "",
    },
  });

  // Populate form and selectedServices when initialData is available
  useEffect(() => {
    if (initialData && billing) {
      // Assuming billingItems is part of the billing data
      const billingItemServiceIds =
        billingItems.map((item) => item.serviceId) || [];

      // Filter services to only include those that are in billingItems
      const filteredServices = services.filter((service) =>
        billingItemServiceIds.includes(service.id)
      );

      const currentDate = new Date().toISOString().split("T")[0];
      const updatedServices = filteredServices.map((service) => ({
        service,
        price: service.price,
        date: currentDate, // Update the date if needed
      }));

      setSelectedServices(updatedServices);

      // Reset the form with initial values
      form.reset({
        ...form.getValues(),
        name: fullName,
        forInsurance: String(billing?.forInsurance),
        forAics: String(billing?.forAics),
        userCategory: billing?.userCategory,
      });
    }
  }, [initialData, fullName, form, billing, services, billingItems]);

  const onSubmit = async (values: z.infer<typeof AppointmentFormSchema>) => {
    try {
      setIsLoading(true);
      const selectedVaccinationData = selectedVaccination.map((v) => ({
        id: v.vaccination?.id || "", // Ensure vaccination ID is mapped
        quantity: v.quantity || 0, // Ensure quantity is mapped, default to 0 if null
      }));
      const response = await createBillingAppointment(
        values,
        selectedServices,
        appointmentId,
        selectedVaccinationData,
        userId
      );
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.success);
        if (site === "admin") {
          router.push(`/admin/dashboard/appointment`);
        } else {
          router.push(`/branch/${params.branchId}/appointment`);
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (index: number, serviceId: string) => {
    const selected = services.find((service) => service.id === serviceId);
    if (selected) {
      const currentDate = new Date().toISOString().split("T")[0];
      const updatedServices = [...selectedServices];
      updatedServices[index] = {
        service: selected,
        price: selected.price,
        date: currentDate,
      };
      setSelectedServices(updatedServices); // Update the selected services array
    }
  };

  const handleVaccinationSelect = (index: number, vaccinationId: string) => {
    const selected = vaccinations.find(
      (vaccination) => vaccination.id === vaccinationId
    );
    if (selected) {
      const currentDate = new Date().toISOString().split("T")[0];
      const updatedVaccinations = [...selectedVaccination];
      updatedVaccinations[index] = {
        vaccination: selected,
        date: currentDate,
        quantity: selectedVaccination[index].quantity ?? 1,
      };
      setSelectedVaccination(updatedVaccinations);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedVaccinations = [...selectedVaccination];
    updatedVaccinations[index].quantity = quantity;
    setSelectedVaccination(updatedVaccinations);
  };

  const addAnotherService = () => {
    setSelectedServices([
      ...selectedServices,
      { service: null, price: null, date: null },
    ]);
  };

  const addAnotherVaccination = () => {
    setSelectedVaccination([
      ...selectedVaccination,
      { vaccination: null, date: null, quantity: 1 },
    ]);
  };

  return (
    <div className="flex flex-col">
      <Heading
        title="Manage Appointment and Billing"
        description="Update appointment details and manage billing information for patients."
      />
      <Form {...form}>
        <form
          className="w-full space-y-5 mt-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Input
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            type="hidden"
          />
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            type="hidden"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Name"
            placeholder="Enter Name"
            disabled={true}
          />
          <div>
            <Label>Dosage and Other Services</Label>
            <Table>
              <TableBody>
                {selectedServices.map((serviceData, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Label className="sr-only">Service</Label>
                      {serviceData.service ? ( // Check if there is an initial service
                        <Input
                          value={serviceData.service.name} // Show the service name in the input
                          disabled // Make the input disabled
                        />
                      ) : (
                        <Select
                          onValueChange={(serviceId) =>
                            handleServiceSelect(index, serviceId)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services?.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <Label className="sr-only">Price</Label>
                      <Input
                        type="number"
                        value={serviceData.price ?? ""}
                        disabled
                      />
                    </TableCell>
                    <TableCell>
                      <Label className="sr-only">Date</Label>
                      <Input disabled value={serviceData.date ?? ""} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={addAnotherService}
                    >
                      Add another service
                    </Button>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <div>
            <Label>Vaccination</Label>
            <Table>
              <TableBody>
                {selectedVaccination.map((vaccinationData, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Label className="sr-only">Vaccination</Label>
                      {vaccinationData.vaccination ? ( // Check if there is an initial service
                        <Input
                          value={vaccinationData.vaccination.name} // Show the service name in the input
                          disabled // Make the input disabled
                        />
                      ) : (
                        <Select
                          onValueChange={(vaccinationId) =>
                            handleVaccinationSelect(index, vaccinationId)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Vaccination" />
                          </SelectTrigger>
                          <SelectContent>
                            {vaccinations?.map((vaccination) => (
                              <SelectItem
                                key={vaccination.id}
                                value={vaccination.id}
                              >
                                {vaccination.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <Label className="sr-only">Quantity</Label>
                      <Input
                        value={vaccinationData.quantity ?? 1}
                        onChange={(e) =>
                          handleQuantityChange(index, Number(e.target.value))
                        }
                        placeholder="Enter quantity"
                      />
                    </TableCell>
                    <TableCell>
                      <Label className="sr-only">Date</Label>
                      <Input disabled value={vaccinationData.date ?? ""} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={addAnotherVaccination}
                    >
                      Add another vaccination
                    </Button>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <FormField
            control={form.control}
            name="userCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="4PS">4PS</SelectItem>
                    <SelectItem value="POINT OF SERVICE (FINANCIALLY INCAPABLE)">
                      POINT OF SERVICE (FINANCIALLY INCAPABLE)
                    </SelectItem>
                    <SelectItem value="LISTAHANAN">LISTAHANAN</SelectItem>
                    <SelectItem value="SELF-EMPLOYED/INDIVIDUAL PAYING">
                      SELF-EMPLOYED/INDIVIDUAL PAYING
                    </SelectItem>
                    <SelectItem value="SENIOR CITIZEN">
                      SENIOR CITIZEN
                    </SelectItem>
                    <SelectItem value="EMPLOYED GOVERNMENT">
                      EMPLOYED GOVERNMENT
                    </SelectItem>
                    <SelectItem value="EMPLOYED PRIVATE">
                      EMPLOYED PRIVATE
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="forInsurance"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Insurance</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="forAics"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>AICS</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-5"
            variant="destructive"
            disabled={isLoading}
          >
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentForm;
