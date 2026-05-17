import { cn } from "@/lib/utils"

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple"
  size?: "sm" | "md"
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = "default", size = "sm", children, className }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-gray-300",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-aether-500/10 text-aether-400 border-aether-500/20",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
