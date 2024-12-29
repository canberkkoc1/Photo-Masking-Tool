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


    // Redraw all drawings on the canvas
    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.src = imageURL;

        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            drawings.forEach((drawing) => {
                if (drawing.type === "brush") {
                    ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
                    ctx.lineWidth = 20;
                    ctx.lineCap = "round";
                    ctx.beginPath();
                    drawing.points.forEach(
                        (point: { x: number; y: number }, index: number) => {
                            if (index === 0) ctx.moveTo(point.x, point.y);
                            else ctx.lineTo(point.x, point.y);
                        }
                    );
                    ctx.stroke();
                } else if (drawing.type === "rectangle") {
                    const { x, y, width, height } = drawing.points;
                    ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, width, height);
                } else if (drawing.type === "lasso") {
                    ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    drawing.points.forEach(
                        (point: { x: number; y: number }, index: number) => {
                            if (index === 0) ctx.moveTo(point.x, point.y);
                            else ctx.lineTo(point.x, point.y);
                        }
                    );
                    ctx.closePath();
                    ctx.stroke();
                }
            });

            // Draw the current rectangle dynamically if it exists
            if (currentRectangle) {
                const { x, y, width, height } = currentRectangle;
                ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, width, height);
            }
        };
    };




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
            redrawCanvas();
        } else if (mode === "rectangle" && startPoint) {
            const width = x - startPoint.x;
            const height = y - startPoint.y;

            setCurrentRectangle({ x: startPoint.x, y: startPoint.y, width, height });
            redrawCanvas();
        } else if (mode === "lasso") {
            setDrawings((prev) => {
                const updatedDrawings = [...prev];
                const currentDrawing = updatedDrawings[updatedDrawings.length - 1];
                currentDrawing.points.push({ x, y });
                return updatedDrawings;
            });
            redrawCanvas();
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
        redrawCanvas();
    };


    const handleExport = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const exportCanvas = document.createElement("canvas");
        const exportCtx = exportCanvas.getContext("2d");
        if (!exportCtx) return;

        exportCanvas.width = canvas.width;
        exportCanvas.height = canvas.height;

        exportCtx.fillStyle = "black";
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        drawings.forEach((drawing) => {
            exportCtx.fillStyle = "white";
            exportCtx.strokeStyle = "white";
            if (drawing.type === "brush") {
                exportCtx.lineWidth = 20;
                exportCtx.lineCap = "round";
                exportCtx.beginPath();
                drawing.points.forEach(
                    (point: { x: number; y: number }, index: number) => {
                        if (index === 0) exportCtx.moveTo(point.x, point.y);
                        else exportCtx.lineTo(point.x, point.y);
                    }
                );
                exportCtx.stroke();
            } else if (drawing.type === "rectangle") {
                const { x, y, width, height } = drawing.points;
                exportCtx.fillRect(x, y, width, height);
            } else if (drawing.type === "lasso") {
                exportCtx.beginPath();
                drawing.points.forEach(
                    (point: { x: number; y: number }, index: number) => {
                        if (index === 0) exportCtx.moveTo(point.x, point.y);
                        else exportCtx.lineTo(point.x, point.y);
                    }
                );
                exportCtx.closePath();
                exportCtx.fill();
            }
        });

        const dataURL = exportCanvas.toDataURL("image/png");
        onExportCanvas(dataURL);
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
            onClick={handleExport}
            className="mt-4 px-4 py-2 bg-red-900 text-white hover:bg-red-300 hover:text-black"
        >
            Export
        </button>
    </div>
    )
}