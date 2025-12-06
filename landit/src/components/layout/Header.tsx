"use client"
import React from 'react'
import { CalendarFold, Moon, Sun } from 'lucide-react'
import Image from "next/image"
import { useTheme } from '../common/ThemeContext'
import Link from 'next/link'

const Header = () => {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
    <div className="flex items-center gap-3">
     <Link href="/" className="flex items-center gap-3">
     <Image 
      src="/figma/logo.png" 
      alt="LandIT Logo" 
      width={40} 
      height={40}
     />
      <span className="text-2xl font-bold text-gray-900 dark:text-white">
      LandIT
      </span>
     </Link>
     </div>

        {/* Actions */}
        <div className="flex items-center gap-4">

          {/* Get Started Button */}
          <Link href="/dashboard">
          <button className="px-4 py-2 text-md font-medium text-gray-900 dark:text-white rounded-2xl border border-stone-200 dark:border-gray-700 hover:bg-cyan-400 dark:hover:bg-cyan-600 transition-colors flex items-center gap-2">
            <CalendarFold className="w-5 h-5" />
            Get Started
          </button>
          </Link>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header