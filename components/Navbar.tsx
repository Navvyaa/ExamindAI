import React from 'react'
import { ArrowLeft, Clipboard, HelpCircle, Bell, ChevronDown, SparkleIcon } from 'lucide-react'
import { useAssessmentStore } from '@/store/assessmentStore'

export default function Navbar() {
    const {resetAssessment}=useAssessmentStore();
    return (
        <nav className='px-6 py-4 bg-white/95 rounded-2xl w-full sticky drop-shadow-sm'>
            <div className='hidden md:flex items-center justify-between'>
                <div className='flex gap-4 items-center'>
                    <div className='hover:bg-neutral-100 p-2 rounded-full'>
                        <ArrowLeft onClick={resetAssessment} size={20} className='font-bold text-black ' />
                    </div>
                    <div className='text-sm text-neutral-400 font-bold flex gap-2 items-center'>
                        <Clipboard size={20} />
                        <span>Exams</span>
                    </div>
                </div>
                <div className='flex items-center gap-6 text-black'>
                    <HelpCircle size={24} />
                    <div className='relative '>
                        <Bell size={24} />
                        <div className='w-1.5 h-1.5 rounded-full bg-red-500 absolute top-0 right-0' />
                    </div>
                    <SparkleIcon fill='currentcolor'size={24}/>

                    <div className='flex items-center gap-2'>
                        <div className='w-9 h-9 rounded-full bg-neutral-400'/>
                        <p>Navya Gupta</p>
                        <ChevronDown />
                    </div>
                </div>

            </div>
            <div className='md:hidden flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <ArrowLeft size={20}/>
                    <p className=''>VedaAI</p>
                </div>

            </div>

        </nav>
    )
}

