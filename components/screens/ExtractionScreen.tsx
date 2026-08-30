import { useAssessmentStore } from '@/store/assessmentStore'
import Image from 'next/image';

export default function ExtractionScreen(){

    const {processingStep}=useAssessmentStore();

   const header=()=>{
    switch(processingStep){
        case "extracting-questions":
        case "extracting-answers":
            return "Extracting..."
        case "mapping-answers":
            return "Mapping Answers..."
        case "grading" :
            return "Grading..."
    }
   } 
  return (
    <div className='w-full h-full flex items-center justify-center bg-white rounded-xl p-6 flex-col gap-6'>
        <Image src="/Loading.svg" width={200} height={200} alt='Loading...' className='animate-pulse'/>
        <p className='lg:text-3xl font-bold mt-6 '>{header()}</p>
        <p className='text-gray-400'>This may take a while.</p>
    </div>
  )
}
