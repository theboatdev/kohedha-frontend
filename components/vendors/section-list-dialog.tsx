"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getSections, Section } from "@/lib/sections";
import { Loader2, MapPin } from "lucide-react";

interface SectionListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
}

export function SectionListDialog({
  open,
  onOpenChange,
  selectedSectionId,
  onSelectSection,
}: SectionListDialogProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchSections();
    }
  }, [open]);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getSections(true);
      setSections(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch sections");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>View & Select Sections</DialogTitle>
          <DialogDescription>
            {onSelectSection
              ? "Click on a section to select it and manage its tables"
              : "All sections for your venue"}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : sections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No sections found
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section._id}
                onClick={() => {
                  if (onSelectSection) {
                    onSelectSection(section._id);
                    onOpenChange(false);
                  }
                }}
                className={`p-4 border rounded-lg transition-colors ${
                  onSelectSection
                    ? "cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                    : "hover:bg-gray-50"
                } ${
                  selectedSectionId === section._id
                    ? "bg-blue-50 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <h4 className="font-semibold">{section.sectionName}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 capitalize">
                      {section.sectionType}
                    </p>
                    {section.description && (
                      <p className="text-sm text-gray-500 mt-2">
                        {section.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      section.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {section.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
