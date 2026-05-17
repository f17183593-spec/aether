"use client"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const base = "relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
    const variants = {
      primary: "bg-gradient-to-r from-aether-600 to-pink-600 text-white hover:shadow-lg hover:shadow-aether-500/25 hover:scale-[1.02] active:scale-[0.98]",
      secondary: "glass glass-hover text-white",
      ghost: "text-gray-400 hover:text-white hover:bg-white/5",
      danger: "bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30",
      outline: "border border-white/10 text-white hover:bg-white/5",
    }
    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-6 py-3 gap-2.5",
    }

    return (
      <motion.button
        ref={ref as any}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button }
export type { ButtonProps }
