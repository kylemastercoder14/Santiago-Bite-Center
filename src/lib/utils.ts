import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  interval: number
) {
  const timeSlots = [];
  let currentTime = parseTime(startTime);
  const endTimeParsed = parseTime(endTime);

  while (currentTime <= endTimeParsed) {
    timeSlots.push({
      id: timeSlots.length + 1,
      time: formatTime(currentTime),
    });
    currentTime.setMinutes(currentTime.getMinutes() + interval);
  }

  return timeSlots;
}

function parseTime(timeStr: string) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatTime(date: any) {
  let hours = date.getHours();
  let minutes = date.getMinutes();

  const modifier = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutes} ${modifier}`;
}

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT";
    useCompact?: boolean;
  } = {}
) {
  const { currency = "PHP", useCompact = false } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: useCompact ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

export function parseAddress(address: string) {
  const addressParts = address.split(", ").map((part) => part.trim());

  // Check if we have at least four parts
  if (addressParts.length < 4) {
    return {
      houseNumber: "",
      region: "",
      province: "",
      municipality: "",
      barangay: "",
    };
  }

  const [barangay, municipality, province, region] = addressParts.slice(-4);
  const houseNumber = addressParts.slice(0, -4).join(" ");

  return {
    houseNumber,
    region,
    province,
    municipality,
    barangay,
  };
}
