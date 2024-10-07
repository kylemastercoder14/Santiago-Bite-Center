/* eslint-disable no-unused-vars */
import { E164Number } from "libphonenumber-js/core";
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";
import { Control } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Checkbox } from "./ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import SingleImageUpload from "./single-image-upload";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DATE_DEFAULT_FORMAT, DATE_DISPLAY_FORMAT, DATE_YEAR_MIN } from "@/lib/validators";
import { Calendar } from "./ui/custom-calendar";

export enum FormFieldType {
  INPUT = "input",
  NUMBER = "number",
  TEXTAREA = "textarea",
  PASSWORD = "password",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  UPLOAD = "upload",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  type?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              type={props.type}
              placeholder={props.placeholder}
              {...field}
              disabled={props.disabled}
              className="shad-input border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.NUMBER:
      return (
        <div className="flex rounded-md border">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              type="number"
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.UPLOAD:
      return (
        <FormControl>
          <SingleImageUpload
            className="w-full"
            defaultValue={field.value || null}
            onImageUpload={(urls) => field.onChange(urls)}
          />
        </FormControl>
      );
    case FormFieldType.PASSWORD:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={props.placeholder}
                {...field}
                className="shad-input focus-visible:ring-offset-0 focus-visible:ring-0 border-0 flex-grow"
              />
              <div
                className="mr-3 mt-2 cursor-pointer"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-zinc-400" />
                ) : (
                  <Eye className="h-5 w-5 text-zinc-400" />
                )}
              </div>
            </>
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="PH"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone focus-visible:ring-offset-0 focus-visible:ring-0"
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outlineSecondary"}
                className={cn(
                  "flex w-full pl-2 justify-start font-normal focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed",
                  !field.value && "text-muted-foreground"
                )}
                disabled={props.disabled}
              >
                <CalendarIcon className="mr-4 h-4 w-4" />
                {field.value ? (
                  format(field.value, DATE_DISPLAY_FORMAT)
                ) : (
                  <span>Select a date</span>
                )}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent align="start" className=" w-auto p-0">
            <Calendar
              mode="single"
              captionLayout="dropdown-buttons"
              selected={field.value ? new Date(field.value) : undefined}
              onSelect={(date) =>
                date && field.onChange(format(date, DATE_DEFAULT_FORMAT))
              }
              fromYear={DATE_YEAR_MIN}
              toYear={new Date().getFullYear()}
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
