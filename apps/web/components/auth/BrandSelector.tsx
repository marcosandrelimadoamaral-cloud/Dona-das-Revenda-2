"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface BrandSelectorProps {
  brands: { id: string; label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function BrandSelector({ brands, selected, onChange }: BrandSelectorProps) {
  const toggleBrand = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((b) => b !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {brands.map((brand) => {
        const isSelected = selected.includes(brand.id)
        return (
          <div
            key={brand.id}
            onClick={() => toggleBrand(brand.id)}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              isSelected
                ? "bg-purple-50 border-purple-500 dark:bg-purple-900/20 dark:border-purple-500"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center ${
                isSelected ? "bg-purple-600 border-purple-600 text-white" : "border-gray-300"
              }`}
            >
              {isSelected && <Check className="w-3 h-3" />}
            </div>
            <span
              className={`text-sm ${
                isSelected ? "font-medium text-purple-900 dark:text-purple-100" : ""
              }`}
            >
              {brand.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
