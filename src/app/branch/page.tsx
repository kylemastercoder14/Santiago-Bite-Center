"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const BranchPage = ({ params }: { params: { branchId: string } }) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return (
      <Loader2
        size={100}
        className="animate-spin flex items-center justify-center m-auto"
      />
    );
  }
  if (!user) {
    router.push("/branch/auth");
  }

  return null;
};

export default BranchPage;
