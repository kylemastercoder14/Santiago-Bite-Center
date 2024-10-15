"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { useSignIn } from "@clerk/nextjs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Branch } from "@prisma/client";
import { getAllBranches } from "@/actions/branch";

const BranchAuthModal = () => {
  const [branch, setBranch] = useState("");
  const [branchData, setBranchData] = useState<Branch[]>([]);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchBranches = async () => {
      const response = await getAllBranches();
      setBranchData(response);
    };
    fetchBranches();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    if (!isLoaded) return;

    try {
      setIsPending(true);
      
      const signInAttempt = await signIn.create({
        identifier: email,
        password: password,
      });

      // If sign-in process is complete, set the created session as active and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push(`/branch/${branch}/patient`);
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      setError(error.message || "No user found with the provided credentials.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="max-w-7xl mx-auto mt-40 p-5">
      <CardHeader>
        <CardTitle>Branch Access Verification</CardTitle>
        <CardDescription>
          To access the branch page, please enter the information below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="space-y-1">
            <Label>Email Address</Label>
            <Input
              placeholder="Enter email address"
              type="email"
              value={email}
              disabled={isPending}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1 mt-2">
            <Label>Password</Label>
            <Input
              placeholder="Enter password"
              type="password"
              disabled={isPending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1 mt-2">
            <Label>Branch</Label>
            <Select
              defaultValue={branch}
              onValueChange={(value) => setBranch(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branchData.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            {error && (
              <p className="text-red-700 text-sm font-semibold mt-4 flex justify-center">
                {error}
              </p>
            )}
          </div>
          <Button
            onClick={onSubmit}
            disabled={isPending}
            type="submit"
            className="mt-5 w-full"
            variant="destructive"
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BranchAuthModal;
