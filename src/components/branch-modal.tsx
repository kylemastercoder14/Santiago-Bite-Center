"use client";
import { useBranchModal } from "@/hooks/use-branch-modal";
import React, { FormEvent, useState } from "react";
import { Modal } from "./ui/modal";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createBranch } from "@/actions/branch";
import { useRouter } from "next/navigation";

const BranchModal = () => {
  const branchModal = useBranchModal();
  const [loading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [head, setHead] = useState("");
  const [nameError, setNameError] = useState("");
  const [headError, setHeadError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setNameError("");
    setHeadError("");
    setAddressError("");

    let hasError = false;

    if (!name) {
      setNameError("Branch Name is required.");
      hasError = true;
    }
    if (!head) {
      setHeadError("Branch Head is required.");
      hasError = true;
    }
    if (!address) {
      setAddressError("Branch Address is required.");
      hasError = true;
    }

    if (hasError) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      const data = await createBranch(name, head, address);
      if (data.error) {
        toast.error(data.error);
        return;
      }
      toast.success(data.success);
      branchModal.onClose();
      window.location.assign(`/admin/branch/${data.branchId}`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      title="Create Branch"
      description="Add a new branch to manage appointments and other features on your facility."
      isOpen={branchModal.isOpen}
      onClose={branchModal.onClose}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label>
            Branch Name <span className="text-red-700">*</span>
          </Label>
          <Input
            className={`${nameError ? "border-red-700 placeholder:text-red-700" : "border-input"}`}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value) {
                setNameError("");
              }
            }}
            disabled={loading}
            placeholder="Enter Branch Name"
          />
          {nameError && <p className="text-red-700 text-sm">{nameError}</p>}
        </div>
        <div className="space-y-1">
          <Label>
            Branch Contact Number <span className="text-red-700">*</span>
          </Label>
          <Input
            className={`${headError ? "border-red-700 placeholder:text-red-700" : "border-input"}`}
            value={head}
            onChange={(e) => {
              setHead(e.target.value);
              if (e.target.value) {
                setHeadError("");
              }
            }}
            disabled={loading}
            placeholder="Enter Branch Contact Number"
          />
          {headError && <p className="text-red-700 text-sm">{headError}</p>}
        </div>
        <div className="space-y-1">
          <Label>
            Branch Address <span className="text-red-700">*</span>
          </Label>
          <Textarea
            className={`${addressError ? "border-red-700 placeholder:text-red-700" : "border-input"}`}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (e.target.value) {
                setAddressError("");
              }
            }}
            disabled={loading}
            placeholder="Enter Branch Address"
          />
          {addressError && (
            <p className="text-red-700 text-sm">{addressError}</p>
          )}
        </div>
        <Button type="submit" disabled={loading} variant="destructive">
          {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </form>
    </Modal>
  );
};

export default BranchModal;
