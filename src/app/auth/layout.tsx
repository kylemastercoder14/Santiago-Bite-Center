"use client";

import AvatarCircles from "@/components/magic-ui/multiple-avatar-circle";
import { TooltipProvider } from "@/components/ui/tooltip";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

const avatarUrls = [
  "https://avatars.githubusercontent.com/u/16860528",
  "https://avatars.githubusercontent.com/u/20110627",
  "https://avatars.githubusercontent.com/u/106103625",
  "https://avatars.githubusercontent.com/u/59228569",
];

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const getBackgroundImage = () => {
    switch (true) {
      case pathname === "/auth/sign-up":
        return "/images/auth-bg.jpg";
      case pathname === "/auth/sign-in":
        return "/images/signin.jpg";
      default:
        return "/default.jpg";
    }
  };

  return (
    <TooltipProvider>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <Image
          src={getBackgroundImage()}
          alt="Background Image"
          fill
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />

        {/* Centered Children */}
        <div className="relative flex items-center justify-center h-full">
          {children}
        </div>

        {/* Avatar Circles at the Bottom */}
        <div className="absolute bottom-0 w-full flex justify-center pb-10">
          <div className="flex flex-col items-center">
            <p className="text-white text-center leading-7 text-lg italic max-w-7xl">
              &quot;I recently had to visit the Santiago Animal Bite Center
              after my dog got into a scuffle with a stray. From the moment I
              arrived, I was impressed with the level of care and
              professionalism exhibited by the entire staff.&quot;
            </p>
            <AvatarCircles
              className="mt-4"
              numPeople={5}
              avatarUrls={avatarUrls}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AuthLayout;
