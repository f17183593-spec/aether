"use client"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -4 } : undefined}
      className={cn(
        "glass-card rounded-2xl p-6 transition-all duration-500",
        hover && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  )
}
