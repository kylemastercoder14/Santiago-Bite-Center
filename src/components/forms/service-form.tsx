"use client";

import { ServiceFormSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Service } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AlertModal from "../alert-modal";
import { toast } from "sonner";
import { Heading } from "@/components/ui/heading";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Separator } from "../ui/separator";
import { Form } from "../ui/form";
import CustomFormField, { FormFieldType } from "../custom-formfield";
import SubmitButton from "../submit-button";
import { Input } from "../ui/input";
import { createService, deleteService, updateService } from "@/actions/service";

interface ServiceFormProps {
  initialData: Service | null;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ initialData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serviceId, setServiceId] = useState(initialData?.id ?? "");
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = initialData ? "Edit Service" : "Add Service";
  const description = initialData ? "Edit a service" : "Add a new service";
  const action = initialData ? "Save Changes" : "Create Service";
  const form = useForm<z.infer<typeof ServiceFormSchema>>({
    resolver: zodResolver(ServiceFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof ServiceFormSchema>) => {
    try {
      setIsLoading(true);
      if (!initialData) {
        await createService(values).then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            router.push(`/admin/dashboard/service`);
            window.location.assign("/admin/dashboard/service");
          }
        });
      } else {
        await updateService(values, serviceId).then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            router.push(`/admin/dashboard/service`);
            window.location.assign("/admin/dashboard/service");
          }
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await deleteService(serviceId).then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          router.push(`/admin/dashboard/service`);
          window.location.assign("/admin/dashboard/service");
        }
      });
    } catch (error) {
      toast.error(
        "Something went wrong while deleting the service. Please try again later."
      );
      console.log(error);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isLoading}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            onClick={() => setOpen(true)}
            size="icon"
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5"
        >
          <Input
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            type="hidden"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Service Name"
            placeholder="Enter Service Name"
            disabled={isLoading}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="price"
            label="Service Price"
            type="number"
            placeholder="Enter Service Price"
            disabled={isLoading}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="description"
            label="Service Description"
            placeholder="Enter Service Description"
            disabled={isLoading}
          />
          <SubmitButton className="ml-auto" isLoading={isLoading}>
            {action}
          </SubmitButton>
        </form>
      </Form>
    </>
  );
};

export default ServiceForm;
