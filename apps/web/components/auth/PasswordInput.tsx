"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Lock } from "lucide-react"

interface PasswordInputProps {
  name: string
  id?: string
  placeholder?: string
  showStrength?: boolean
  value?: string
  autoComplete?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function PasswordInput({ name, id, placeholder = "Sua senha", showStrength = false, value, autoComplete, onChange }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [internalValue, setInternalValue] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value)
    if (onChange) onChange(e)
  }

  const val = value !== undefined ? value : internalValue

  const getStrength = (pass: string) => {
    if (pass.length === 0) return 0
    let score = 0
    if (pass.length >= 8) score += 1
    if (pass.length >= 10) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    return score
  }

  const strength = getStrength(val)

  return (
    <div className="space-y-2">
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          id={id || name}
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          className="pl-10 pr-10"
          value={val}
          onChange={handleChange}
          required
          minLength={8}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {showStrength && val.length > 0 && (
        <div className="flex gap-1 mt-1">
          <div className={`h-1 w-full rounded-full ${strength >= 1 ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-800'}`} />
          <div className={`h-1 w-full rounded-full ${strength >= 2 ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-800'}`} />
          <div className={`h-1 w-full rounded-full ${strength >= 3 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-800'}`} />
          <div className={`h-1 w-full rounded-full ${strength >= 4 ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-800'}`} />
        </div>
      )}
    </div>
  )
}
