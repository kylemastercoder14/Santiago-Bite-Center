"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn, encryptKey, decryptKey } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { toast } from "sonner";

const AdminModal = () => {
  const [open, setOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);

      localStorage.setItem("accessKey", encryptedKey);

      setOpen(false);
    } else {
      setError("Invalid passkey. Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            Admin Access Verification
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="w-full flex justify-between">
              <InputOTPSlot
                className="justify-center flex border border-zinc-300 rounded-lg size-16 gap-4"
                index={0}
              />
              <InputOTPSlot
                className="justify-center flex border border-zinc-300 rounded-lg size-16 gap-4"
                index={1}
              />
              <InputOTPSlot
                className="justify-center flex border border-zinc-300 rounded-lg size-16 gap-4"
                index={2}
              />
              <InputOTPSlot
                className="justify-center flex border border-zinc-300 rounded-lg size-16 gap-4"
                index={3}
              />
              <InputOTPSlot
                className="justify-center flex border border-zinc-300 rounded-lg size-16 gap-4"
                index={4}
              />
              <InputOTPSlot
                className="justify-center flex border border-zinc-300 rounded-lg size-16 gap-4"
                index={5}
              />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-red-700 text-sm font-semibold mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className={cn(buttonVariants({ variant: "destructive" }), "w-full")}
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminModal;
