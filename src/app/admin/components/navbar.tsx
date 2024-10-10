"use client";

import Link from "next/link";
import { CircleUser, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CommandMenu } from "./command-menu";
import { useClerk } from "@clerk/nextjs";

const Navbar = () => {
  const { signOut } = useClerk()
  const pathname = usePathname();
  const router = useRouter();
  const routes = [
    {
      href: "/admin/dashboard/overview",
      label: "Dashboard",
    },
    {
      href: "/admin/dashboard/patient",
      label: "Patients",
    },
    {
      href: "/admin/dashboard/appointment",
      label: "Appointments",
    },
    {
      href: "/admin/dashboard/inventory",
      label: "Inventory",
    },
    {
      href: "/admin/dashboard/employee",
      label: "Employee",
    },
    {
      href: "/admin/dashboard/service",
      label: "Services",
    },
    {
      href: "/admin/dashboard/branch",
      label: "Branches",
    },
  ];
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="#" className="flex items-center justify-center">
          <Image src="/images/logo.jpg" alt="Logo" width={320} height={320} />
        </Link>

        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`transition-colors hover:text-foreground ${pathname === route.href ? "text-foreground" : "text-muted-foreground "}`}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden border-input text-muted-foreground hover:text-muted-foreground/90"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="flex items-center justify-center">
              <Image
                src="/images/logo.jpg"
                alt="Logo"
                width={100}
                height={100}
              />
            </Link>

            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`transition-colors hover:text-foreground ${pathname === route.href ? "text-foreground" : "text-muted-foreground "}`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <CommandMenu />
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Administrator</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({redirectUrl: "/admin"})}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
