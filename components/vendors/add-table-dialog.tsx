"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableShape } from "@/lib/tables";
import { Loader2 } from "lucide-react";

const shapeConfig: Record<
  TableShape,
  { label: string; icon: React.ReactNode }
> = {
  square: {
    label: "Square",
    icon: (
      <svg
        width="56"
        height="56"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="8" y="8" width="24" height="24" rx="2" />
      </svg>
    ),
  },
  circle: {
    label: "Circle",
    icon: (
      <svg
        width="56"
        height="56"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="20" cy="20" r="12" />
      </svg>
    ),
  },
  "rectangle-h": {
    label: "Rectangle (Horizontal)",
    icon: (
      <svg
        width="56"
        height="56"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="6" y="14" width="28" height="12" rx="2" />
      </svg>
    ),
  },
  "rectangle-v": {
    label: "Rectangle (Vertical)",
    icon: (
      <svg
        width="56"
        height="56"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="14" y="6" width="12" height="28" rx="2" />
      </svg>
    ),
  },
};

interface AddTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    tableNumber: string;
    seatingCapacity: number;
    shape: TableShape;
  }) => Promise<void>;
  selectedShape: TableShape | null;
}

export function AddTableDialog({
  open,
  onOpenChange,
  onSubmit,
  selectedShape,
}: AddTableDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: "",
    seatingCapacity: 4,
    shape: (selectedShape || "square") as TableShape,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync shape when the dialog opens with a new shape
  useEffect(() => {
    if (selectedShape) {
      setFormData((prev) => ({ ...prev, shape: selectedShape }));
    }
  }, [selectedShape]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.tableNumber.trim()) {
      newErrors.tableNumber = "Table name is required";
    }
    if (formData.seatingCapacity < 1) {
      newErrors.seatingCapacity = "Capacity must be at least 1";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(formData);
      // Reset form
      setFormData({
        tableNumber: "",
        seatingCapacity: 4,
        shape: (selectedShape || "square") as TableShape,
      });
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      setErrors({});
      // Reset form
      setFormData({
        tableNumber: "",
        seatingCapacity: 4,
        shape: (selectedShape || "square") as TableShape,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
          <DialogDescription>
            Create a new table with custom name and seating capacity
          </DialogDescription>
        </DialogHeader>

        {/* Shape Preview */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-center w-20 h-20 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-700">
            {shapeConfig[formData.shape].icon}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">
              Table Shape
            </p>
            <p className="text-base font-semibold text-gray-900">
              {shapeConfig[formData.shape].label}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tableNumber">
              Table Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tableNumber"
              value={formData.tableNumber}
              onChange={(e) =>
                setFormData({ ...formData, tableNumber: e.target.value })
              }
              placeholder="e.g., Table 1, VIP-01, Window-5"
              disabled={isLoading}
              autoFocus
            />
            {errors.tableNumber && (
              <p className="text-xs text-red-500">{errors.tableNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="seatingCapacity">
              Seating Capacity <span className="text-red-500">*</span>
            </Label>
            <Input
              id="seatingCapacity"
              type="number"
              min="1"
              max="50"
              value={formData.seatingCapacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seatingCapacity: parseInt(e.target.value) || 1,
                })
              }
              disabled={isLoading}
            />
            {errors.seatingCapacity && (
              <p className="text-xs text-red-500">{errors.seatingCapacity}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Table
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
