import React from "react";
import SignUpForm from "@/features/auth/components/signup-form";

const SignUp = () => {
  return (
    <div className="flex w-[30%] bg-white p-7 shadow-xl rounded-lg flex-col">
      <SignUpForm />
    </div>
  );
};

export default SignUp;
