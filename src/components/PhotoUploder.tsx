"use client";
import React from "react";

type ImageUploadProps = {
  onSelect: (file: File) => void;
};

export default function ImageUploder({ onSelect }: ImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Check if the file exists and is of a valid type
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert("Only PNG, JPEG, and JPG files are allowed!");
        return;
      }

      onSelect(file);
    }
  };

  return (
    <div className="flex justify-center my-4">
      <label className="cursor-pointer px-4 py-2  bg-black hover:bg-gray-600 text-white">
        Add Photo
        <input
          type="file"
          accept=".png, .jpeg, .jpg" // Restrict file types
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
