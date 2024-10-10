"use client";

import { InventoryFormSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inventory } from "@prisma/client";
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
import { SelectItem } from "../ui/select";
import {
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "@/actions/employee";
import {
  createInventory,
  deleteInventory,
  updateInventory,
} from "@/actions/inventory";

interface InventoryFormProps {
  initialData: Inventory | null;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ initialData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryId, setInventoryId] = useState(initialData?.id ?? "");
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = initialData ? "Edit Vaccine" : "Add Vaccine";
  const description = initialData ? "Edit a vaccine" : "Add a new vaccine";
  const action = initialData ? "Save Changes" : "Create Vaccine";
  const form = useForm<z.infer<typeof InventoryFormSchema>>({
    resolver: zodResolver(InventoryFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      stocks: initialData?.stocks ?? 0,
      buffer: initialData?.buffer ?? 0,
      consume: initialData?.consumed ?? 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof InventoryFormSchema>) => {
    try {
      setIsLoading(true);
      if (!initialData) {
        await createInventory(values, params?.branchId as string).then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            router.push(`/branch/${params.branchId}/inventory`);
            window.location.assign(`/branch/${params.branchId}/inventory`);
          }
        });
      } else {
        await updateInventory(values, inventoryId).then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            router.push(`/branch/${params.branchId}/inventory`);
            window.location.assign(`/branch/${params.branchId}/inventory`);
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
      await deleteInventory(inventoryId).then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          router.push(`/admin/dashboard/inventory`);
          window.location.assign("/admin/dashboard/inventory");
        }
      });
    } catch (error) {
      toast.error(
        "Something went wrong while deleting the vaccine. Please try again later."
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
            value={inventoryId}
            onChange={(e) => setInventoryId(e.target.value)}
            type="hidden"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Vaccine Name"
            placeholder="Enter Vaccine Name"
            disabled={isLoading}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="stocks"
            type="number"
            label="Stocks"
            placeholder="Enter Stocks"
            disabled={isLoading}
          />
          {initialData && (
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="consume"
              type="number"
              label="Consume"
              placeholder="Enter Consume"
              disabled={isLoading}
            />
          )}
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="buffer"
            type="number"
            label="Buffer"
            placeholder="Enter Buffer"
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

export default InventoryForm;
