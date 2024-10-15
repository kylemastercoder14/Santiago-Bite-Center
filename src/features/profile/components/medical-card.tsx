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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MedicalFormValidators } from "../validators";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";
import { Medical } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { createMedicalHistory } from "@/actions/patients";

const MedicalCard = ({ medical }: { medical?: Medical[] }) => {
  const [pending, setIsPending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [medicalHistory, setMedicalHistory] = useState<{
    illness: string;
    postSurgeries: string;
    medication: string;
    dosage: string;
  }[]>(medical?.length ? medical.map(history => ({
    illness: history.illness ?? "",
    postSurgeries: history.postSurgeries ?? "",
    medication: history.medication ?? "",
    dosage: history.dosage ?? "",
  })) : [{ illness: "", postSurgeries: "", medication: "", dosage: "" }]);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await createMedicalHistory(medicalHistory).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          router.push("/complete-registration/treatment");
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

  const isDataPresent = !!medical?.length;

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
            <TableBody>
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
                      disabled={pending || isDataPresent && index < medical?.length}
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
                      disabled={pending || isDataPresent && index < medical?.length}
                      value={history.postSurgeries}
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
                      disabled={pending || isDataPresent && index < medical?.length}
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
                      dosage
                    </Label>
                    <Input
                      id={`dosage-${index}`}
                      placeholder="Enter dosage"
                      value={history.dosage}
                      disabled={pending || isDataPresent && index < medical?.length}
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
                      className="w-full border-input text-muted-foreground hover:text-muted-foreground/90"
                      variant="outline"
                      type="button"
                      disabled={pending || isDataPresent && index < medical?.length}
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
          <Button variant="destructive" disabled={pending || medical === null} type="submit">
            {pending && <LuLoader className="size-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MedicalCard;
