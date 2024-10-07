"use client";

import { uploadToS3 } from "@/lib/s3";
import { Inbox, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SingleImageUpload = ({
  onImageUpload,
  className,
  defaultValue = "",
}: {
  onImageUpload: (url: string) => void;
  defaultValue?: string;
  className?: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string>(defaultValue);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1, // Allow only one file
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        toast.error("You can only upload one image.");
        return;
      }

      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Please upload a smaller image.");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);

      try {
        for (let i = 0; i <= 100; i++) {
          setTimeout(() => {
            setUploadProgress(i);
          }, i * 30);
        }

        const { url } = await uploadToS3(file);
        toast.success("Image uploaded successfully!");
        console.log(url);
        setImageUrl(url); // Replace preview with actual URL
        onImageUpload(url);
      } catch (error) {
        setImageUrl(""); // Clear the preview if upload fails
        toast.error("Image upload failed.");
        console.log(error);
      }
    },
  });

  const handleRemoveImage = () => {
    setImageUrl("");
    toast.info("Image removed.");
    onImageUpload("");
  };

  return (
    <div className={cn("rounded-xl", className)}>
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer dark:bg-neutral-800 bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {imageUrl ? (
          <div className="relative w-[100px] h-[100px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-0 right-0">
              <Button
                variant="destructive"
                type="button"
                size="icon"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Image
              src={imageUrl}
              alt="Uploaded Image"
              className="object-cover"
              fill
            />
          </div>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-orange-600" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drop your image here.
            </p>
          </>
        )}
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-orange-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-orange-600">
            {uploadProgress}% uploaded
          </p>
        </div>
      )}
    </div>
  );
};

export default SingleImageUpload;
