"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { RiHandHeartFill } from "react-icons/ri";
import { FaNewspaper, FaUsers, FaHospital } from "react-icons/fa";
import { ContainerScroll } from "@/components/motion/container-scroll-animation";
import StaffContainer from "../components/staff-container";
import ServicesContainer from "../components/services-container";

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <div className="w-full h-screen">
      <div className="relative flex flex-col items-center justify-center h-[81vh]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="z-0"
          />
        </div>
        <div className="relative -mt-20 px-40 z-10 text-center grid grid-cols-2 gap-60 text-white p-5">
          <Card>
            <CardContent className="p-10 flex items-center flex-col justify-center">
              <p className="text-5xl text-[#a41c24] font-bold">WELCOME!</p>
              <p className="mt-3 font-semibold">
                Santiago Animal Bite Center is a leading facility in Sipocot,
                specializing in the treatment and prevention of animal bites.
                Our expert team is dedicated to providing comprehensive care,
                including vaccination, wound management, and post-exposure
                treatment, ensuring the highest standards of safety and recovery
                for our patients.
              </p>
              <Button
                onClick={() => router.push("/doctors")}
                size="xl"
                className="w-full mt-3"
                variant="destructive"
              >
                Find A Doctor
              </Button>
              <div className="flex items-center justify-center w-full gap-5">
                <Button
                  onClick={() => router.push("/complete-registration/schedule")}
                  size="xl"
                  className="w-full mt-3"
                  variant="outline"
                >
                  Schedule An Appointment
                </Button>
                <Button
                  onClick={() => router.push("/doctors")}
                  size="xl"
                  className="w-full mt-3"
                  variant="outline"
                >
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center flex-col justify-center">
              <div className="w-[630px] rounded-lg h-[350px] relative">
                <Image
                  src="/images/hero-bg.jpg"
                  alt="Background"
                  fill
                  className="w-full h-full rounded-lg"
                />
                <div className="absolute rounded-lg inset-0 w-full h-full bg-gradient-to-r from-[#a41c24] via-red-600 to-red-900 opacity-75 z-10"></div>
                <div className="absolute px-5 inset-0 flex flex-col items-center justify-center z-20">
                  <p className="text-white font-bold text-4xl">
                    We&apos;re here to listen.
                  </p>
                  <p className="text-white font-semibold mt-1 text-sm">
                    Please help us improve your patient experience by clicking
                    this survey link. We value your feedback as we continue to
                    better the care that we provide to our patients.
                  </p>
                  <Button className="mt-5" variant="outlineSecondary" size="xl">
                    Click Here
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-white opacity-40 z-1"></div>
      </div>
      <div className="flex items-center justify-center gap-40 py-10 pt-20 mx-auto">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="bg-[#a41c24] rounded-full p-8">
            <FaUsers className="text-white size-20" />
          </div>
          <p className="font-semibold text-2xl text-[#a41c24]">
            Patient & Family Corner
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="bg-[#a41c24] rounded-full p-8">
            <RiHandHeartFill className="text-white size-20" />
          </div>
          <p className="font-semibold text-2xl text-[#a41c24]">
            Expert & Quality Care
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="bg-[#a41c24] rounded-full p-8">
            <FaNewspaper className="text-white size-20" />
          </div>
          <p className="font-semibold text-2xl text-[#a41c24]">
            Latest Announcements
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="bg-[#a41c24] rounded-full p-8">
            <FaHospital className="text-white size-20" />
          </div>
          <p className="font-semibold text-2xl text-[#a41c24]">Good Facility</p>
        </div>
      </div>
      <div className="flex items-start -mt-24 gap-5 px-20">
        <div className="w-[40%] mt-80">
          <Image src={`/images/santiago-text.jpg`}
              alt="About"
              height={300}
              width={300}
              className="mb-5 -ml-10"
              draggable={false} />
          <p className="text-5xl font-bold mb-2 text-[#a41c24]">
            OUR COMMITMENT TO EXCELLENCE
          </p>
          <p>
            What makes Santiago Animal Bite Center different from other
            Facility? Our family-like environment. <span className="font-semibold text-[#a41c24]">“YOU are family”</span> does not
            just tell our stakeholders that they are our patients or partners.
            It shows that we are willing to go the extra mile, solve problems
            together and put the family’s needs before our own. At SABC, every
            patient is treated like a family member. Each one is guaranteed to
            experience the best care and the warmth and dedication we give to
            our own family.
          </p>
          <Button className="mt-5" variant="destructive" size="lg">Learn More &rarr;</Button>
        </div>
        <div className="w-[60%]">
          <ContainerScroll titleComponent>
            <Image
              src={`/images/hero.jpg`}
              alt="About"
              height={1800}
              width={1000}
              className="mx-auto rounded-2xl h-full object-center"
              draggable={false}
            />
          </ContainerScroll>
        </div>
      </div>
      <div id="services" className="-mt-40 py-10">
        <p className="text-3xl font-bold mb-2 text-[#a41c24] text-center">SERVICES OFFERED</p>
        <ServicesContainer />
      </div>
      <div id="doctors" className="mt-20 py-10">
        <p className="text-3xl font-bold mb-2 text-[#a41c24] text-center">OUR STAFF</p>
        <StaffContainer />
      </div>
    </div>
  );
}