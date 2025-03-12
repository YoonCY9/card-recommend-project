"use client"

import { cn } from "@/lib/utils"
import { CreditCard } from "lucide-react"

type BrandOptionProps = {
  brand: string
  label: string
  isSelected: boolean
  onToggle: (brand: string) => void
}

export default function BrandOption({ brand, label, isSelected, onToggle }: BrandOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(brand)}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md border transition-all",
        isSelected
          ? "bg-primary/10 border-primary text-primary font-medium"
          : "bg-background border-input hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <CreditCard className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}

