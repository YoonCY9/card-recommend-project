"use client"

import type React from "react"

import { cn } from "@/lib/utils"

type FilterOptionProps = {
  value: string
  label: string
  isSelected: boolean
  onToggle: (value: string) => void
  icon?: React.ReactNode
}

export default function FilterOption({ value, label, isSelected, onToggle, icon }: FilterOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(value)}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md border transition-all text-sm",
        isSelected
          ? "bg-primary/10 border-primary text-primary font-medium"
          : "bg-background border-input hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{label}</span>
    </button>
  )
}

