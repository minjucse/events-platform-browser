"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  glowClassName?: string
}

export function GlowCard({ children, className, glowClassName, ...props }: GlowCardProps) {
  return (
    <div
      className={cn(
        "card-glow relative rounded-xl border border-border bg-card p-6 transition-all duration-300",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          glowClassName,
        )}
        style={{
          background:
            "linear-gradient(135deg, var(--glow-primary) 0%, var(--glow-accent) 50%, var(--glow-primary) 100%)",
          filter: "blur(20px)",
          zIndex: -1,
        }}
      />
      {children}
    </div>
  )
}
