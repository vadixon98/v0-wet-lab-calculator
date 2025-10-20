"use client"

import { useState } from "react"
import { Star, Trash2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Preset } from "@/hooks/use-presets"

interface PresetManagerProps {
  presets: Preset[]
  onSave: (name: string) => void
  onLoad: (id: string) => void
  onDelete: (id: string) => void
  disabled?: boolean
}

export function PresetManager({ presets, onSave, onLoad, onDelete, disabled }: PresetManagerProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [presetName, setPresetName] = useState("")

  const handleSave = () => {
    if (presetName.trim()) {
      onSave(presetName.trim())
      setPresetName("")
      setSaveDialogOpen(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSaveDialogOpen(true)}
          disabled={disabled}
          className="gap-2 hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-900/20 transition-all"
        >
          <Star className="w-4 h-4" />
          Save Preset
        </Button>

        {presets.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-sky-50 hover:border-sky-300 dark:hover:bg-sky-900/20 transition-all bg-transparent"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                Load Preset
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {presets.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  className="flex items-center justify-between group cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault()
                  }}
                >
                  <button
                    onClick={() => onLoad(preset.id)}
                    className="flex-1 text-left py-1 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(preset.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(preset.id)
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Preset</DialogTitle>
            <DialogDescription>Give your preset a memorable name so you can quickly load it later.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="preset-name" className="text-sm font-medium">
              Preset Name
            </Label>
            <Input
              id="preset-name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="e.g., Standard PBS Dilution"
              className="mt-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!presetName.trim()}>
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
