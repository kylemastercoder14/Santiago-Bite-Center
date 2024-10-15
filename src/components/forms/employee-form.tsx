"use client";

import { EmployeeFormSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Branch, Employee } from "@prisma/client";
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
import { useSignUp } from "@clerk/nextjs";

interface EmployeeFormProps {
  initialData: Employee | null;
  branch: Branch[];
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, branch }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(initialData?.id ?? "");
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = initialData ? "Edit Employee" : "Add Employee";
  const description = initialData ? "Edit a employee" : "Add a new employee";
  const action = initialData ? "Save Changes" : "Create Employee";
  const form = useForm<z.infer<typeof EmployeeFormSchema>>({
    resolver: zodResolver(EmployeeFormSchema),
    defaultValues: {
      firstName: initialData?.firstName ?? "",
      lastName: initialData?.lastName ?? "",
      email: initialData?.email ?? "",
      role: initialData?.role ?? "",
      branch: initialData?.branchId ?? "",
      imageUrl: initialData?.imageUrl ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof EmployeeFormSchema>) => {
    if (!isLoaded) return;
    try {
      setIsLoading(true);
      if (!initialData) {
        await createEmployee(values).then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            router.push(`/admin/dashboard/employee`);
            window.location.assign("/admin/dashboard/employee");
          }
        });
      } else {
        await updateEmployee(values, employeeId).then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            router.push(`/admin/dashboard/employee`);
            window.location.assign("/admin/dashboard/employee");
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
      await deleteEmployee(employeeId).then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          router.push(`/admin/dashboard/employee`);
          window.location.assign("/admin/dashboard/employee");
        }
      });
    } catch (error) {
      toast.error(
        "Something went wrong while deleting the employee. Please try again later."
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
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            type="hidden"
          />
          <div className="grid grid-cols-2 gap-5">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="firstName"
              label="First Name"
              placeholder="Enter First Name"
              disabled={isLoading}
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="lastName"
              label="Last Name"
              placeholder="Enter Last Name"
              disabled={isLoading}
            />
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter Email Address"
            disabled={isLoading}
          />
          <div className="grid grid-cols-2 gap-5">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="branch"
              label="Branch"
              placeholder="Select Branch"
              disabled={isLoading}
            >
              {branch?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name} - {item.address}
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="role"
              label="Position"
              placeholder="Select Position"
              disabled={isLoading}
            >
              <SelectItem value="Secretary">Secretary</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Nurse">Nurse</SelectItem>
            </CustomFormField>
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.UPLOAD}
            name="imageUrl"
            label="Image"
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

export default EmployeeForm;
