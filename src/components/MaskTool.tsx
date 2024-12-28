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

     // Load the image and reset canvas when mode or image changes
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

            setDrawings([]);
            setCurrentRectangle(null);
        };
    }, [imageURL,mode]);



    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);

        // Get the bounding rectangle of the canvas element and calculate the mouse position
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

         // Start a new drawing based on the selected mode
        if (mode === "rectangle") {
            setStartPoint({ x, y });
            setCurrentRectangle(null);
        } else if (mode === "brush" || mode === "lasso") {
            setDrawings((prev) => [...prev, { type: mode, points: [{ x, y }] }]);
        }
    };


    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (mode === "brush") {
            setDrawings((prev) => {
                const updatedDrawings = [...prev];
                const currentDrawing = updatedDrawings[updatedDrawings.length - 1];
                currentDrawing.points.push({ x, y });
                return updatedDrawings;
            });
           
        } else if (mode === "rectangle" && startPoint) {
            const width = x - startPoint.x;
            const height = y - startPoint.y;

            setCurrentRectangle({ x: startPoint.x, y: startPoint.y, width, height });
          
        } else if (mode === "lasso") {
            setDrawings((prev) => {
                const updatedDrawings = [...prev];
                const currentDrawing = updatedDrawings[updatedDrawings.length - 1];
                currentDrawing.points.push({ x, y });
                return updatedDrawings;
            });
            
        }
    };



    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        if (mode === "rectangle" && startPoint && currentRectangle) {
            setDrawings((prev) => [
                ...prev,
                { type: "rectangle", points: currentRectangle },
            ]);
            setCurrentRectangle(null);
        }
        setIsDrawing(false);
        setStartPoint(null);

    };



    return(
        <div className="flex flex-col items-center">
        <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
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