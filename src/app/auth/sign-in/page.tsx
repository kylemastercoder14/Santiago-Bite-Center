import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import SignInForm from "@/features/auth/components/signin-form";

const SignIn = () => {
  return (
    <div className="flex w-[30%] bg-white p-7 shadow-xl rounded-lg flex-col">
      <h2 className="md:text-4xl text-2xl font-bold">Welcome Back</h2>
      <p className="text-muted-foreground text-sm">
        Enter all the informations required.
      </p>
      <div className="grid gap-4 w-full mt-5">
        <SignInForm />
        <div className="flex items-center gap-4 justify-center">
          <div className="flex-1 border-t border-gray-500"></div>
          <span>Or continue with</span>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>
        <div className="flex items-center justify-center gap-2 w-full">
          <SignInButtonIcon strategy="facebook" />
          <SignInButtonIcon strategy="google" />
          <SignInButtonIcon strategy="microsoft" />
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos; have an account?{" "}
          <Link href="/auth/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

const SignInButtonIcon = (props: { strategy: string }) => {
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

export default SignIn;
