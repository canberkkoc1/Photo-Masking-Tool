"use client";
import React, { useState } from "react";
import ImageUpload from "@/components/PhotoUploder";
import Toolbar from "@/components/Toolbar";
import MaskEditor from "@/components/MaskTool";

export default function Home() {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [mode, setMode] = useState<"brush" | "rectangle" | "lasso">("brush");

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setImageURL(reader.result as string);
      }
    };

    reader.onerror = () => {
      alert("Failed to read the file!");
    };

    reader.readAsDataURL(file);
  };

  const handleModeChange = (newMode: "brush" | "rectangle" | "lasso") => {
    setMode(newMode);
  };

  const handleExportCanvas = (dataURL: string) => {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "masked-image.png";
    link.click();
  };

  return (
    <main className="min-h-screen bg-white text-white flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-black">Photo Masking Tool</h1>
      {!imageURL && <ImageUpload onSelect={handleImageSelect} />}

      {imageURL && (
        <>
        <MaskEditor imageURL={imageURL} mode={mode} onExportCanvas={handleExportCanvas} />
          <div
            className="flex justify-center w-full mt-4"
            style={{ maxWidth: "600px" }}
          >
            <Toolbar onModeChange={handleModeChange} currentMode={mode} />
          </div>
        </>
      )}
    </main>
  );
}
