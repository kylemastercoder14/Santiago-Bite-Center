"use client";

import * as React from "react";
import {
  PersonIcon,
} from "@radix-ui/react-icons";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Contact,
  FileSpreadsheet,
  Hospital,
  LayoutDashboard,
  LogOut,
  MessageSquareMore,
  Send,
  Server,
  Users,
} from "lucide-react";
import Link from "next/link";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <p
        onClick={() => setOpen(true)}
        className="text-sm hover:bg-accent bg-zinc-50 cursor-pointer border-input px-3 py-1 flex justify-between rounded-md sm:w-[300px] md:w-[200px] lg:w-[300px] border text-muted-foreground"
      >
        Search anything here...{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Components">
            <CommandItem asChild>
              <Link
                href="/admin/dashboard/overview"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link
                href="/admin/dashboard/service"
                onClick={() => setOpen(false)}
              >
                <Server className="mr-2 h-4 w-4" />
                <span>Services</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link
                href="/admin/dashboard/branch"
                onClick={() => setOpen(false)}
              >
                <Hospital className="mr-2 h-4 w-4" />
                <span>Branches</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link
                href="/admin/dashboard/employee"
                onClick={() => setOpen(false)}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Employee</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link
                href="/admin/dashboard/patient"
                onClick={() => setOpen(false)}
              >
                <Contact className="mr-2 h-4 w-4" />
                <span>Patients</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link
                href="/admin/dashboard/appointments"
                onClick={() => setOpen(false)}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>Appointments</span>
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem asChild>
              <Link
                href="/admin/dashboard/profile"
                onClick={() => setOpen(false)}
              >
                <PersonIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link
                href="/admin/dashboard/feedbacks"
                onClick={() => setOpen(false)}
              >
                <Send className="mr-2 h-4 w-4" />
                <span>Feedbacks</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link
                href="/admin/dashboard/messages"
                onClick={() => setOpen(false)}
              >
                <MessageSquareMore className="mr-2 h-4 w-4" />
                <span>Messages</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link
                href="/admin/dashboard/messages"
                onClick={() => setOpen(false)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
