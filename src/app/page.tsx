"use client";
import React, { useState } from "react";
import ImageUpload from "@/components/PhotoUploder";

export default function Home() {
  const [imageURL, setImageURL] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setImageURL(reader.result as string);
      }
    };

    reader.onerror = () => {
      alert("Failed to read the file!");
    }


    reader.readAsDataURL(file);
  };

  return (
    <main className="min-h-screen bg-white text-white flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-black">Photo Masking Tool</h1>
      {!imageURL && <ImageUpload onSelect={handleImageSelect} />}
    </main>
  );
}
