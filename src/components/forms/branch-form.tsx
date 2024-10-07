"use client";

import { BranchFormSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Branch } from "@prisma/client";
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
import { createBranch, deleteBranch, updateBranch } from "@/actions/branch";
import { Input } from "../ui/input";

interface BranchFormProps {
  initialData: Branch | null;
}

const BranchForm: React.FC<BranchFormProps> = ({ initialData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [branchId, setBranchId] = useState(initialData?.id ?? "");
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = initialData ? "Edit Branch" : "Add Branch";
  const description = initialData ? "Edit a branch" : "Add a new branch";
  const action = initialData ? "Save Changes" : "Create Branch";
  const form = useForm<z.infer<typeof BranchFormSchema>>({
    resolver: zodResolver(BranchFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      contact: initialData?.contact ?? "",
      address: initialData?.address ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof BranchFormSchema>) => {
    try {
      setIsLoading(true);
      if (!initialData) {
        await createBranch(values).then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            router.push(`/admin/dashboard/branch`);
            window.location.assign("/admin/dashboard/branch");
          }
        });
      } else {
        await updateBranch(values, branchId).then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            router.push(`/admin/dashboard/branch`);
            window.location.assign("/admin/dashboard/branch");
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
      await deleteBranch(branchId).then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          router.push(`/admin/dashboard/branch`);
          window.location.assign("/admin/dashboard/branch");
        }
      });
    } catch (error) {
      toast.error(
        "Something went wrong while deleting the branch. Please try again later."
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
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            type="hidden"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Branch Name"
            placeholder="Enter Branch Name"
            disabled={isLoading}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="contact"
            label="Branch Contact"
            placeholder="Enter Branch Contact"
            disabled={isLoading}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="address"
            label="Branch Address"
            placeholder="Enter Branch Address"
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

export default BranchForm;
