"use client"

import { useEffect } from "react"

// Campos onde digitar, selecionar e colar precisam continuar funcionando.
const EDITABLE = "input, textarea, select, [contenteditable='true'], [contenteditable='']"

function isEditable(target: EventTarget | null) {
  return target instanceof Element && target.closest(EDITABLE) !== null
}

/**
 * Trava seleção, cópia e arrastar de texto e imagens nas páginas públicas.
 * É uma barreira de conveniência: quem tem conhecimento técnico ainda consegue
 * contornar (código-fonte, print). Campos de formulário ficam liberados.
 */
export function ContentProtection() {
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-protected", "true")

    const block = (e: Event) => {
      if (isEditable(e.target)) return
      e.preventDefault()
    }
    const events = ["copy", "cut", "contextmenu", "dragstart", "selectstart"] as const
    events.forEach((ev) => document.addEventListener(ev, block))

    return () => {
      root.removeAttribute("data-protected")
      events.forEach((ev) => document.removeEventListener(ev, block))
    }
  }, [])

  return null
}
