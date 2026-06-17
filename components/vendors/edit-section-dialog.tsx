"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/lib/sections";

interface EditSectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  section: Section;
  isLoading?: boolean;
}

const sectionTypes = [
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
  { value: "vip", label: "VIP" },
  { value: "rooftop", label: "Rooftop" },
  { value: "other", label: "Other" },
];

export function EditSectionDialog({
  isOpen,
  onClose,
  onSubmit,
  section,
  isLoading = false,
}: EditSectionDialogProps) {
  const [formData, setFormData] = useState({
    sectionName: section.sectionName,
    sectionType: section.sectionType,
    description: section.description || "",
    isActive: section.isActive,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when section changes
  useEffect(() => {
    setFormData({
      sectionName: section.sectionName,
      sectionType: section.sectionType,
      description: section.description || "",
      isActive: section.isActive,
    });
  }, [section]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.sectionName.trim()) {
      newErrors.sectionName = "Section name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    setErrors({});
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="font-bebas text-2xl tracking-tight">
            Edit Section
          </DialogTitle>
          <DialogDescription className="font-poppins text-sm">
            Update section details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="sectionName"
              className="text-sm font-medium font-poppins"
            >
              Section Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sectionName"
              placeholder="e.g., Rooftop, Indoor, VIP Lounge"
              value={formData.sectionName}
              onChange={(e) =>
                setFormData({ ...formData, sectionName: e.target.value })
              }
              className={`font-poppins ${errors.sectionName ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {errors.sectionName && (
              <p className="text-xs text-red-500 font-poppins">
                {errors.sectionName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="sectionType"
              className="text-sm font-medium font-poppins"
            >
              Section Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.sectionType}
              onValueChange={(value) =>
                setFormData({ ...formData, sectionType: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="font-poppins">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {sectionTypes.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="font-poppins"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium font-poppins"
            >
              Description (Optional)
            </Label>
            <textarea
              id="description"
              placeholder="Brief description of this section..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full min-h-24 px-3 py-2 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
              disabled={isLoading}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 font-poppins text-right">
              {formData.description.length}/500
            </p>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label
                htmlFor="isActive"
                className="text-sm font-medium font-poppins"
              >
                Active Status
              </Label>
              <p className="text-xs text-gray-500 font-poppins">
                Enable or disable this section
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="font-poppins"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-black hover:bg-gray-900 text-white font-poppins"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
