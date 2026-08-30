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
import ErrorScreen from "@/components/screens/ErrorScreen";
import SidePanel from "@/components/SidePanel";


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
          
          case "error":
          return <ErrorScreen />;
      case "mapping-answers":
      case "complete":
        return <ReviewScreen/>

      default:
        return <UploadScreen />;
    }
  };
  
return (
  <main className="h-dvh max-h-full flex gap-6 text-black px-6 py-4 bg-[linear-gradient(180deg,_#F5F5F5_0%,_#E9E5E5_100%)]">
      <div className="hidden md:block">
      <SidePanel/>
      </div>
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <Navbar />
      <div className="flex-1 min-h-0 mt-6">
        {renderScreen()}
      </div>
    </div>
  </main>
);
}