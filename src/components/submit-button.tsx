import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}
const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      variant="destructive"
      className={className ?? "w-full"}
    >
      {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
};

export default SubmitButton;
