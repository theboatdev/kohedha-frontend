"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSections, Section } from "@/lib/sections";
import { Loader2 } from "lucide-react";

interface SectionSelectorProps {
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string | null) => void;
}

export function SectionSelector({
  selectedSectionId,
  onSelectSection,
}: SectionSelectorProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getSections(true); // Only active sections
      setSections(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch sections");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading sections...
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (sections.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No sections available. Create a section first.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Select Section
      </label>
      <Select
        value={selectedSectionId || "all"}
        onValueChange={(value) =>
          onSelectSection(value === "all" ? null : value)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a section" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sections</SelectItem>
          {sections.map((section) => (
            <SelectItem key={section._id} value={section._id}>
              <div className="flex items-center justify-between gap-2">
                <span>{section.sectionName}</span>
                <span className="text-xs text-gray-500 capitalize">
                  ({section.sectionType})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedSectionId && (
        <p className="text-xs text-gray-600">
          Viewing:{" "}
          {sections.find((s) => s._id === selectedSectionId)?.sectionName ||
            "Unknown"}
        </p>
      )}
    </div>
  );
}
