"use client";

import { useEffect } from "react";
import { useAssessmentStore } from "@/store/assessmentStore";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorScreen() {
    const { error, setProcessingStep, resetAssessment } = useAssessmentStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            resetAssessment();
            setProcessingStep("idle");
        }, 5000);

        return () => clearTimeout(timer);
    }, [setProcessingStep, resetAssessment]);

    return (
        <div className="h-full min-h-0 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
                    <AlertCircle className="text-red-600" size={48} />
                </div>

                <h1 className="lg:text-3xl text-xl font-bold text-gray-900 mb-4">
                    Oops! Something went wrong
                </h1>

                <p className="lg:text-lg text-gray-600 lg:mb-8 mb-3 max-w-md">
                    {error || "An unexpected error occurred during processing."}
                </p>

                <div className="flex items-center justify-center text-base text-gray-500 mb-8">
                    <RotateCcw size={20} className="mr-3 animate-spin" />
                    Resetting in 5 seconds...
                </div>

                <button
                    onClick={() => {
                        resetAssessment();
                        setProcessingStep("idle");
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition lg:text-lg"
                >
                    Reset Now
                </button>
            </div>
        </div>
    );
}