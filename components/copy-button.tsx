"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  value: string
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)

      // Create confetti effect
      createConfetti()

      // Show toast notification
      showToast("Copied! 🎉")

      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      showToast("Failed to copy")
    }
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleCopy}
      className="h-8 w-8 p-0 hover:bg-sky-100 dark:hover:bg-sky-900/20 transition-all duration-200 hover:scale-110 active:scale-95"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500 animate-in zoom-in duration-200" />
      ) : (
        <Copy className="w-4 h-4 text-slate-500" />
      )}
    </Button>
  )
}

function createConfetti() {
  const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"]
  const confettiCount = 15

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div")
    confetti.style.position = "fixed"
    confetti.style.width = "6px"
    confetti.style.height = "6px"
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.borderRadius = "50%"
    confetti.style.pointerEvents = "none"
    confetti.style.zIndex = "9999"
    confetti.style.left = Math.random() * window.innerWidth + "px"
    confetti.style.top = Math.random() * window.innerHeight + "px"
    confetti.style.animation = "confetti-fall 1s ease-out forwards"

    document.body.appendChild(confetti)

    setTimeout(() => {
      document.body.removeChild(confetti)
    }, 1000)
  }
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
