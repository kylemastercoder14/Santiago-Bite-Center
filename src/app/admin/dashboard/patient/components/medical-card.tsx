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
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { createMedicalHistory } from "@/actions/patients";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";

const MedicalCard = () => {
  const [pending, setIsPending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [medicalHistory, setMedicalHistory] = useState([
    { illness: "", postSurgeries: "", medication: "", dosage: "" },
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await createMedicalHistory(medicalHistory, "walk-in").then((data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          router.push("/admin/dashboard/patient/new/incident");
        }
      });
    } catch (error) {
      toast.error("Failed to create medical history. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const addMedicalHistory = () => {
    setMedicalHistory([
      ...medicalHistory,
      { illness: "", postSurgeries: "", medication: "", dosage: "" },
    ]);
  };

  const removeMedicalHistory = (index: number) => {
    setMedicalHistory(medicalHistory.filter((_, i) => i !== index));
  };

  const handleMedicalHistoryChange = (
    index: number,
    key: keyof {
      illness: string;
      postSurgeries: string;
      medication: string;
      dosage: string;
    },
    value: string
  ) => {
    const newMedicalHistory = [...medicalHistory];
    newMedicalHistory[index][key] = value;
    setMedicalHistory(newMedicalHistory);
  };

  if (!isMounted) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical History</CardTitle>
        <CardDescription>
          This information is essential for accurately managing your medical
          records and ensuring effective communication with healthcare
          providers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-3">
          <Table className="flex flex-col">
            <TableBody className="w-full">
              {medicalHistory.map((history, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Label htmlFor={`illness-${index}`} className="sr-only">
                      Illness/Diagnosis
                    </Label>
                    <Input
                      id={`illness-${index}`}
                      placeholder="Enter Illness/Diagnosis"
                      value={history.illness}
                      disabled={pending}
                      onChange={(e) =>
                        handleMedicalHistoryChange(
                          index,
                          "illness",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Label
                      htmlFor={`postSurgeries-${index}`}
                      className="sr-only"
                    >
                      Post Surgery
                    </Label>
                    <Input
                      id={`postSurgeries-${index}`}
                      placeholder="Enter Post Surgery"
                      value={history.postSurgeries}
                      disabled={pending}
                      onChange={(e) =>
                        handleMedicalHistoryChange(
                          index,
                          "postSurgeries",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Label htmlFor={`medication-${index}`} className="sr-only">
                      Prescribed Medication
                    </Label>
                    <Input
                      id={`medication-${index}`}
                      placeholder="Enter Prescribed Medication"
                      value={history.medication}
                      disabled={pending}
                      onChange={(e) =>
                        handleMedicalHistoryChange(
                          index,
                          "medication",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Label htmlFor={`dosage-${index}`} className="sr-only">
                      Dosage
                    </Label>
                    <Input
                      id={`dosage-${index}`}
                      placeholder="Enter Dosage"
                      value={history.dosage}
                      disabled={pending}
                      onChange={(e) =>
                        handleMedicalHistoryChange(
                          index,
                          "dosage",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      type="button"
                      disabled={pending}
                      onClick={() => removeMedicalHistory(index)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <div className="flex w-full">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="gap-1 w-full border-t flex items-center justify-center"
                onClick={addMedicalHistory}
              >
                <PlusCircledIcon className="h-3.5 w-3.5" />
                Add Medical History
              </Button>
            </div>
          </Table>
          <Button variant="destructive" disabled={pending} type="submit">
            {pending && <LuLoader className="size-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MedicalCard;
