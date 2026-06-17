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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableShape, updateTable } from "@/lib/tables";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditTableDialogProps {
  table: Table | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const tableShapes: { value: TableShape; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "circle", label: "Circle" },
  { value: "rectangle-h", label: "Rectangle (Horizontal)" },
  { value: "rectangle-v", label: "Rectangle (Vertical)" },
];

export function EditTableDialog({
  table,
  open,
  onOpenChange,
  onSuccess,
}: EditTableDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: "",
    seatingCapacity: 4,
    shape: "square" as TableShape,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (table) {
      setFormData({
        tableNumber: table.tableNumber,
        seatingCapacity: table.seatingCapacity,
        shape: table.shape || "square",
        isActive: table.isActive,
      });
      setErrors({});
    }
  }, [table]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!table) return;

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
      const response = await updateTable(table._id, {
        tableNumber: formData.tableNumber,
        seatingCapacity: formData.seatingCapacity,
        shape: formData.shape,
        isActive: formData.isActive,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Table updated successfully",
        });
        onSuccess();
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update table",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Edit Table</DialogTitle>
          <DialogDescription>
            Update table details and configuration
          </DialogDescription>
        </DialogHeader>

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
              placeholder="e.g., Table 1, VIP-01"
              disabled={isLoading}
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

          <div className="space-y-2">
            <Label htmlFor="shape">Table Shape</Label>
            <Select
              value={formData.shape}
              onValueChange={(value: TableShape) =>
                setFormData({ ...formData, shape: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shape" />
              </SelectTrigger>
              <SelectContent>
                {tableShapes.map((shape) => (
                  <SelectItem key={shape.value} value={shape.value}>
                    {shape.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              disabled={isLoading}
              className="w-4 h-4"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Active (available for reservations)
            </Label>
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
