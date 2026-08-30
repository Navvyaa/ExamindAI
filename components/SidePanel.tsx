import React from 'react'
import { Home, BookOpen, FileText, Zap, Library,Clipboard } from 'lucide-react'

export default function SidePanel() {

  return (
    <div className='bg-white h-full w-80 rounded-xl flex flex-col'>
      {/* Header */}
      <div className='p-6  border-gray-200'>
        <div className='flex items-center gap-2 mb-4'>
          <div className='w-8 h-8 bg-gray-900 rounded flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>V</span>
          </div>
          <span className='font-bold text-lg'>VedaAI</span>
        </div>
        <button className='w-full border-2 bg-black border-orange-500 text-white py-2 px-1 rounded-full font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition'>
          <Zap size={18} />
          AI Teacher's Toolkit
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className='flex-1 py-6 px-4'>
        <div className='space-y-2'>
          <NavItem icon={Home} label="Home" active={false} />
          <NavItem icon={BookOpen} label="My Classroom" active={false} />
          <NavItem icon={FileText} label="Assignments" active={false} />
          <NavItem icon={Clipboard} label="Exams" active={true} />
          <NavItem icon={Library} label="My Library" active={false} />
        </div>
      </nav>

      {/* School Info */}
      <div className='p-4 bg-neutral-100 m-4 rounded-xl'>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-lg'>
            🌿
          </div>
          <div>
            <p className='font-semibold text-lg'>Delhi Public School</p>
            <p className='text-sm text-gray-500'>Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ComponentType<{ size: number }>
  label: string
  active: boolean
}

function NavItem({ icon: Icon, label, active }: NavItemProps) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${active
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-700 hover:bg-gray-50'
        }`}
    >
      <Icon size={20} />
      <span className='text-sm font-medium'>{label}</span>
    </button>
  )
}
