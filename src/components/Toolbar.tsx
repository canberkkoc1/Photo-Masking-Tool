"use client";
import React from "react";



type ToolbarProps = {
    onModeChange: (mode: "brush" | "rectangle" | "lasso") => void;
    currentMode: "brush" | "rectangle" | "lasso";
};

export default function Toolbar({ onModeChange, currentMode }: ToolbarProps) {
    const getButtonClass = (mode: "brush" | "rectangle" | "lasso") => {

        return `flex flex-col items-center justify-center px-4 py-2  ${currentMode === mode
            ? "border-2 border-green-500 bg-black text-white"
            : "text-gray-300 hover:border-green-500 hover:text-white"
            }`;
    };

    return (
        <div className="flex items-center justify-center space-x-4 bg-black p-4 rounded-lg h-20">
            {/* Lasso Button */}
            <button
                onClick={() => onModeChange("lasso")}
                className={getButtonClass("lasso")}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6 mb-1"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12c0 4.418 3.582 8 8 8m0-16c-4.418 0-8 3.582-8 8zm0 8c4.418 0 8-3.582 8-8m0 16c-4.418 0-8-3.582-8-8z"
                    />
                </svg>
                <span className="text-sm">Lasso</span>
            </button>


            <div className="border-l-2 border-gray-800 h-8"></div>

            {/* Brush Button */}
            <button
                onClick={() => onModeChange("brush")}
                className={getButtonClass("brush")}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6 mb-1"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 13.5V19c0 .828-.336 1.582-.879 2.121A3 3 0 003 23h1c1.657 0 3-1.343 3-3v-6.5m4.172 3.828a4.5 4.5 0 016.364 0 4.5 4.5 0 000 6.364M6.343 6.343a4.5 4.5 0 010 6.364L9.879 6m-3.536 0L6 9"
                    />
                </svg>
                <span className="text-sm">Brush</span>
            </button>

            <div className="border-l-2 border-gray-800 h-8"></div>

            {/* Rectangle Button */}
            <button
                onClick={() => onModeChange("rectangle")}
                className={getButtonClass("rectangle")}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6 mb-1"
                >
                    <rect
                        x="5"
                        y="5"
                        width="14"
                        height="14"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <span className="text-sm">Rectangle</span>
            </button>
        </div>
    );
}