"use client";

import { Button } from "@/components/ui/button";
import { PatientColumn } from "./column";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import AlertModal from "@/components/alert-modal";
import { deleteBranch } from "@/actions/branch";
import { deletePatient } from "@/actions/patients";

interface CellActionProps {
  data: PatientColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const onCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success("Data copied to the clipboard");
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await deletePatient(data.patientId).then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          router.push(`/branch/${params.branchId}/patient`);
          window.location.assign(`/branch/${params.branchId}/patient`);
        }
      });
    } catch (error) {
      toast.error(
        "Something went wrong while deleting the patient. Please try again later."
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/branch/${params.branchId}/patient/${data.id}`)
            }
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </DropdownMenuItem>
          {params.branchId === data.branchId && (
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/branch/${params.branchId}/patient/${data.patientId}/update`
                )
              }
            >
              <Edit className="w-4 h-4 mr-2" />
              Update
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => onCopy(data.name)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {params.branchId === data.branchId && (
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
