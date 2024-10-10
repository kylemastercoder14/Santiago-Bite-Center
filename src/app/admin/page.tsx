"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const router = useRouter();
  const {user, isLoaded} = useUser();
  if(!isLoaded) {
    return <Loader2 size={100} className="animate-spin flex items-center justify-center m-auto" />
  }
  if(!user) {
    router.push("/admin/auth");
  } else {
    router.push("/admin/dashboard/overview");
  }

  return null;
};

export default AdminPage;
