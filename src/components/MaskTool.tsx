"use client";
import React, { useRef, useEffect, useState } from "react";

type MaskEditorProps = {
    imageURL: string;
    mode: "brush" | "rectangle" | "lasso";
    onExportCanvas: (dataURL: string) => void;
};


export default function MaskEditor({
    imageURL,
    mode,
    onExportCanvas,
}: MaskEditorProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
        null
    );
    const [drawings, setDrawings] = useState<{ type: string; points: any }[]>([]);
    const [currentRectangle, setCurrentRectangle] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);


    useEffect(() => {
        const img = new Image();
        img.src = imageURL;
    
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
    
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
    
            canvas.width = img.width;
            canvas.height = img.height;
    
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }, [imageURL]);



    return(
        <div className="flex flex-col items-center">
        <canvas
            ref={canvasRef}
            style={{ border: "1px solid black" }}
        />
        <button
            className="mt-4 px-4 py-2 bg-red-900 text-white hover:bg-red-300 hover:text-black"
        >
            Export
        </button>
    </div>
    )
}