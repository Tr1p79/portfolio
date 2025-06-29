// components/ui/CustomDropdown.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

interface DropdownOption {
  value: string
  label: string
}

interface CustomDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  required = false
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const optionsRef = useRef<HTMLButtonElement[]>([])

  const selectedOption = options.find(option => option.value === value)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : options.length - 1
          )
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (focusedIndex >= 0) {
            onChange(options[focusedIndex].value)
            setIsOpen(false)
            setFocusedIndex(-1)
          }
          break
        case 'Escape':
          setIsOpen(false)
          setFocusedIndex(-1)
          buttonRef.current?.focus()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, focusedIndex, options, onChange])

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
      optionsRef.current[focusedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [focusedIndex])

  const handleToggle = () => {
    if (disabled) return
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Reset focus to current selection when opening
      const currentIndex = options.findIndex(option => option.value === value)
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0)
    }
  }

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setFocusedIndex(-1)
    buttonRef.current?.focus()
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Main Button */}
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full px-4 py-3 text-left bg-white/10 backdrop-blur-sm border border-white/20 
          rounded-xl text-white transition-all duration-300 focus:outline-none 
          focus:border-purple-400/50 focus:bg-white/15 hover:bg-white/15
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen ? 'border-purple-400/50 bg-white/15' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required}
      >
        <div className="flex items-center justify-between">
          <span className={`block truncate ${
            selectedOption ? 'text-white' : 'text-gray-400'
          }`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-purple-400' : ''
            }`} 
          />
        </div>
      </motion.button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 max-h-60 overflow-auto bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/20"
            role="listbox"
          >
            <div className="py-2">
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  ref={el => {
                    if (el) optionsRef.current[index] = el
                  }}
                  type="button"
                  onClick={() => handleOptionClick(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`
                    w-full px-4 py-3 text-left text-sm transition-all duration-200 flex items-center justify-between
                    ${focusedIndex === index 
                      ? 'bg-white/15 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                    ${option.value === value 
                      ? 'bg-purple-500/20 text-white border-l-2 border-purple-400' 
                      : ''
                    }
                  `}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-purple-400 flex-shrink-0 ml-2" />
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* No options message */}
            {options.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-400 text-sm">
                No options available
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}