"use client";

import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { createUser } from "@/actions/user";
import { useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuLoader } from "react-icons/lu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const SignUpForm = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [givenName, setGivenName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    const maskedLocalPart =
      localPart.length > 3
        ? `${"*".repeat(localPart.length - 3)}${localPart.slice(-3)}`
        : localPart;
    return `${maskedLocalPart}@${domain}`;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (!isLoaded) return;
      try {
        await signUp.create({
          emailAddress: email,
          password: password,
          firstName: givenName,
          lastName: familyName,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        // Set 'verifying' true to display second form and capture the OTP code
        setVerifying(true);
        toast.success("Verification code sent to your email.");
      } catch (error: any) {
        console.error("Registration error:", error);
        toast.error(error?.message || "An error occurred during registration.");
      }
    });
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      // If verification was completed, set the session to active and redirect the user
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/complete-registration");
      } else {
        toast.error("Something went wrong. Please try again.");
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (error: any) {
      console.error("Error:", JSON.stringify(error, null, 2));
      toast.error(error?.message || "An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  if (verifying) {
    return (
      <>
        <h2 className="md:text-4xl text-2xl font-bold">Verify Your Email</h2>
        <p className="text-muted-foreground text-sm">
          Enter the OTP code that we sent to your email{" "}
          <span className="font-semibold">{maskEmail(email)}</span> and be
          careful not to share the code with anyone.
        </p>
        <form className="mt-3" onSubmit={handleVerify}>
          <InputOTP
            value={code}
            onChange={(value) => setCode(value)}
            maxLength={6}
            disabled={isLoading}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          >
            <InputOTPGroup className="w-full flex justify-center gap-3">
              <InputOTPSlot
                index={0}
                className="justify-center flex border rounded-lg size-20"
              />
              <InputOTPSlot
                index={1}
                className="justify-center flex border rounded-lg size-20"
              />
              <InputOTPSlot
                index={2}
                className="justify-center flex border rounded-lg size-20"
              />
              <InputOTPSlot
                index={3}
                className="justify-center flex border rounded-lg size-20"
              />
              <InputOTPSlot
                index={4}
                className="justify-center flex border rounded-lg size-20"
              />
              <InputOTPSlot
                index={5}
                className="justify-center flex border rounded-lg size-20"
              />
            </InputOTPGroup>
          </InputOTP>
          <Button type="submit" disabled={isLoading} className="w-full mt-3">
            {isLoading && <LuLoader className="animate-spin w-4 h-4 mr-2" />}
            Continue
          </Button>
        </form>
      </>
    );
  }

  return (
    <>
      <h2 className="md:text-4xl text-2xl font-bold">Account Details</h2>
      <p className="text-muted-foreground text-sm">
        Enter all the information required.
      </p>
      <form onSubmit={handleRegister} className="grid space-y-3 mt-4">
        <div className="grid grid-cols-2 gap-x-2">
          <div>
            <Label htmlFor="givenName">First Name</Label>
            <Input
              id="givenName"
              type="text"
              placeholder="Juan"
              required
              disabled={isPending}
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="familyName">Last Name</Label>
            <Input
              id="familyName"
              type="text"
              placeholder="Dela Cruz"
              required
              disabled={isPending}
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="someone@example.com"
            required
            disabled={isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="--------"
            required
            disabled={isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button disabled={isPending} className="w-full mt-3">
          {isPending && <LuLoader className="animate-spin w-4 h-4 mr-2" />}
          Create Account
        </Button>
      </form>
      <div className="grid gap-4 w-full mt-5">
        <div className="flex items-center gap-4 justify-center">
          <div className="flex-1 border-t border-gray-500"></div>
          <span>Or continue with</span>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>
        <div className="flex items-center justify-center gap-2 w-full">
          <SignUpButtonIcon strategy="facebook" />
          <SignUpButtonIcon strategy="google" />
          <SignUpButtonIcon strategy="microsoft" />
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
};

const SignUpButtonIcon = (props: { strategy: string }) => {
  switch (props.strategy) {
    case "facebook":
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="flex w-full items-center gap-x-2 border-input"
            >
              <Image
                src="/images/fb.png"
                alt="Facebook"
                width="20"
                height="20"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Continue with Facebook</p>
          </TooltipContent>
        </Tooltip>
      );
    case "google":
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="flex w-full items-center gap-x-2 border-input"
            >
              <Image
                src="/images/google.png"
                alt="Google"
                width="20"
                height="20"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Continue with Google</p>
          </TooltipContent>
        </Tooltip>
      );
    case "microsoft":
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="flex w-full items-center gap-x-2 border-input"
            >
              <Image
                src="/images/microsoft.png"
                alt="Microsoft"
                width="20"
                height="20"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Continue with Microsoft</p>
          </TooltipContent>
        </Tooltip>
      );
    default:
      return null;
  }
};

export default SignUpForm;
