"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { EditSectionDialog } from "./edit-section-dialog";
import { Section } from "@/lib/sections";

type SectionCardProps = {
  section: Section;
  onEdit: (sectionId: string, data: any) => void;
  onDelete: (sectionId: string) => void;
  isLoading?: boolean;
};

const getSectionTypeColor = (type: string) => {
  switch (type) {
    case "indoor":
      return {
        background: "#E8E8E4",
        color: "#0D0D0D",
        border: "rgba(13,13,13,0.15)",
      };
    case "outdoor":
      return {
        background: "#E5E7EB",
        color: "#0D0D0D",
        border: "rgba(13,13,13,0.15)",
      };
    case "vip":
      return {
        background: "rgba(245,230,66,0.15)",
        color: "#F5E642",
        border: "rgba(245,230,66,0.3)",
      };
    case "rooftop":
      return {
        background: "#D4CFC3",
        color: "#0D0D0D",
        border: "rgba(13,13,13,0.15)",
      };
    default:
      return {
        background: "#E8E8E4",
        color: "rgba(13,13,13,0.48)",
        border: "rgba(13,13,13,0.15)",
      };
  }
};

const getSectionTypeIcon = (type: string) => {
  return <UtensilsCrossed className="h-4 w-4" />;
};

export function SectionCard({
  section,
  onEdit,
  onDelete,
  isLoading = false,
}: SectionCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = (data: any) => {
    onEdit(section._id, data);
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    onDelete(section._id);
  };

  const handleToggleStatus = () => {
    onEdit(section._id, { isActive: !section.isActive });
  };

  return (
    <>
      <div
        className="rounded-lg p-6 transition-all duration-200 hover:shadow-md"
        style={{
          border: `1px solid rgba(13,13,13,0.15)`,
          background: section.isActive ? "#ffffff" : "#E8E8E4",
          opacity: section.isActive ? 1 : 0.85,
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3
                    className="font-poppins font-semibold text-lg"
                    style={{ color: "#0D0D0D" }}
                  >
                    {section.sectionName}
                  </h3>
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium font-poppins"
                    style={{
                      background: getSectionTypeColor(section.sectionType)
                        .background,
                      color: getSectionTypeColor(section.sectionType).color,
                      border: `1px solid ${getSectionTypeColor(section.sectionType).border}`,
                    }}
                  >
                    {getSectionTypeIcon(section.sectionType)}
                    {section.sectionType.charAt(0).toUpperCase() +
                      section.sectionType.slice(1)}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium font-poppins"
                    style={{
                      background: section.isActive
                        ? "rgba(245,230,66,0.15)"
                        : "rgba(255,255,255,0.3)",
                      color: section.isActive ? "#F5E642" : "rgba(13,13,13,0.48)",
                      border: section.isActive
                        ? "1px solid rgba(245,230,66,0.3)"
                        : "1px solid rgba(13,13,13,0.15)",
                    }}
                  >
                    {section.isActive ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                    {section.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {section.description && (
              <p className="font-poppins text-sm" style={{ color: "rgba(13,13,13,0.48)" }}>
                {section.description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 lg:ml-4">
            <Button
              onClick={() => setIsEditDialogOpen(true)}
              variant="outline"
              size="sm"
              className="w-full lg:w-32 font-poppins text-sm"
              style={{ borderColor: "rgba(13,13,13,0.2)", color: "#0D0D0D" }}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>

            <Button
              onClick={handleToggleStatus}
              variant="outline"
              size="sm"
              className="w-full lg:w-32 font-poppins text-sm"
              style={{
                borderColor: "rgba(13,13,13,0.2)",
                color: section.isActive ? "rgba(13,13,13,0.48)" : "#F5E642",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = section.isActive
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(245,230,66,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
              disabled={isLoading}
            >
              {section.isActive ? (
                <>
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <ToggleRight className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </Button>

            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="outline"
              size="sm"
              className="w-full lg:w-32 font-poppins text-sm"
              style={{
                borderColor: "rgba(245,230,66,0.3)",
                color: "#F5E642",
                background: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(245,230,66,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <EditSectionDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEdit}
        section={section}
        isLoading={isLoading}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Section"
        description={`Are you sure you want to delete "${section.sectionName}"? This action cannot be undone.`}
      />
    </>
  );
}
