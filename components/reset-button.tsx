"use client"

import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResetButtonProps {
  onReset: () => void
}

export function ResetButton({ onReset }: ResetButtonProps) {
  const handleReset = () => {
    onReset()

    const button = document.activeElement as HTMLElement
    if (button) {
      button.classList.add("wiggle")
      setTimeout(() => button.classList.remove("wiggle"), 500)
    }

    // Show toast notification
    showToast("Cleared ✨")
  }

  return (
    <Button
      variant="outline"
      onClick={handleReset}
      className="flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 bg-transparent transition-all duration-200 hover:scale-105 active:scale-95"
    >
      <RotateCcw className="w-4 h-4" />
      Reset
    </Button>
  )
}

function showToast(message: string) {
  const toast = document.createElement("div")
  toast.textContent = message
  toast.style.position = "fixed"
  toast.style.top = "20px"
  toast.style.right = "20px"
  toast.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
  toast.style.color = "white"
  toast.style.padding = "12px 16px"
  toast.style.borderRadius = "8px"
  toast.style.fontSize = "14px"
  toast.style.fontWeight = "500"
  toast.style.zIndex = "10000"
  toast.style.animation = "toast-slide-in 0.3s ease-out forwards"

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = "toast-slide-out 0.3s ease-out forwards"
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 2000)
}
