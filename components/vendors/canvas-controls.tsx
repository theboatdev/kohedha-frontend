"use client";

import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

interface CanvasControlsProps {
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
}

export function CanvasControls({
  backgroundColor,
  onBackgroundColorChange,
}: CanvasControlsProps) {
  return (
    <div className="space-y-4 pt-6 border-t">
      <h3 className="font-semibold text-lg">CANVAS CONTROLS</h3>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Background:</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => onBackgroundColorChange(e.target.value)}
          className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer"
        />
      </div>

     
    </div>
  );
}
