import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { LuMenu } from "react-icons/lu";
import { Button, buttonVariants } from "@/components/ui/button";
import UserButton from "@/features/auth/components/user-button";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import Image from "next/image";

const Navbar = async () => {
  const user = await currentUser();
  let userData = null;
  if (user) {
    userData = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!userData) {
      userData = await db.user.create({
        data: {
          clerkId: user.id,
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.emailAddresses[0]?.emailAddress ?? "",
        },
      });
    }
  }

  return (
    <>
      <div className="lg:flex hidden max-w-7xl py-5 mx-auto items-center">
        <div className="flex items-center">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          <Image
            src="/images/santiago-text.jpg"
            alt="Logo"
            width={150}
            height={150}
          />
        </div>
        <Image
          src="/images/santiago-address.jpg"
          alt="Logo"
          width={300}
          height={300}
        />
        <p className="mx-5">|</p>
        <Image
          src="/images/santiago-philhealth.jpg"
          alt="Logo"
          width={200}
          height={200}
        />
      </div>
      <header className="w-full bg-[#a41c24] border-t flex z-50 h-16 items-center gap-4 border-b justify-center px-[40px]">
        <div className="flex items-center gap-5">
          <nav className="hidden w-full gap-40 text-sm font-medium md:flex items-center">
            <Link
              href="/"
              className="text-white transition-colors hover:text-zinc-200"
            >
              Home
            </Link>
            <Link
              href="#services"
              className="text-white transition-colors hover:text-zinc-200"
            >
              Services Offered
            </Link>
            <Link
              href="/complete-registration"
              className="text-white transition-colors hover:text-zinc-200"
            >
              Appointment
            </Link>
            <Link
              href="#about"
              className="text-white transition-colors hover:text-zinc-200"
            >
              About Us
            </Link>
            <Link
              href="#doctors"
              className="text-white transition-colors hover:text-zinc-200"
            >
              Our Doctors
            </Link>
            {userData ? (
              <UserButton
                email={userData.email as string}
                image={userData.imageUrl as string}
                name={userData.firstName + "" + userData.lastName}
              />
            ) : (
              <Link href="/auth/sign-in" className={buttonVariants()}>
                Sign In
              </Link>
            )}
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 lg:hidden block"
              >
                <LuMenu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="text-white transition-colors hover:text-zinc-200"
                >
                  Home
                </Link>
                <Link
                  href="#services"
                  className="text-white transition-colors hover:text-zinc-200"
                >
                  Services Offered
                </Link>
                <Link
                  href="/complete-registration"
                  className="text-white transition-colors hover:text-zinc-200"
                >
                  Appointment
                </Link>
                <Link
                  href="#about"
                  className="text-white transition-colors hover:text-zinc-200"
                >
                  About Us
                </Link>
                <Link
                  href="#doctors"
                  className="text-white transition-colors hover:text-zinc-200"
                >
                  Our Doctors
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
};

export default Navbar;
