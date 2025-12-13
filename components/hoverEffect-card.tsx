"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface HoverEffectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  glowColor?: "blue" | "purple" | "cyan" | "emerald" | "rose"
}

const glowVariants = {
  blue: "from-blue-500 to-blue-600",
  purple: "from-purple-500 to-purple-600",
  cyan: "from-cyan-400 to-blue-500",
  emerald: "from-emerald-400 to-emerald-600",
  rose: "from-rose-400 to-rose-600",
}

export function HoverEffectCard ({
  children,
  className,
  glowColor = "blue",
  ...props
}: HoverEffectCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600",
        className,
      )}
      {...props}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          `absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100`,
          `bg-gradient-to-br ${glowVariants[glowColor]}`,
        )}
        style={{
          filter: "blur(16px)",
          zIndex: -1,
        }}
      />

      {/* Card content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}