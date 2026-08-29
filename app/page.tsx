"use client";

import UploadCard from "@/components/UploadCard";
import Navbar from "@/components/Navbar";
import { useAssessmentStore } from "@/store/assessmentStore";
import { fileToBase64, pdfToImages } from "@/lib/pdf-to-img";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import UploadScreen from "@/components/screens/UploadScreen";
import ExtractionScreen from "@/components/screens/ExtractionScreen";
import QuestionList from "@/components/review/QuestionList";
import ReviewScreen from "@/components/screens/ReviewScreen";


export default function Home() {

  const {processingStep} = useAssessmentStore();


   const renderScreen = () => {
    switch (processingStep) {
      case "idle":
        return <UploadScreen />;

      case "extracting-questions":
      case "extracting-answers":
      case "mapping-answers":
        case "grading":
          return <ExtractionScreen />;
          
          // case "error":
          // return <Error />;
      case "mapping-answers":
      case "complete":
        return <ReviewScreen/>

      default:
        return <UploadScreen />;
    }
  };
  
return (
  <main className="h-screen flex flex-col text-black px-6 py-4 bg-[linear-gradient(180deg,_#F5F5F5_0%,_#E9E5E5_100%)]">
    <div className="mx-auto max-w-5xl w-full flex-1 min-h-0 flex flex-col">
      <Navbar />

      <div className="flex-1 min-h-0 mt-6">
        {renderScreen()}
      </div>
    </div>
  </main>
);
}