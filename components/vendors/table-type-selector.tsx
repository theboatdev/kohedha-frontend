"use client";

import { cn } from "@/lib/utils";

export type TableShape = "square" | "circle" | "rectangle-h" | "rectangle-v";

interface TableTypeSelectorProps {
  selectedType: TableShape | null;
  onSelectType: (type: TableShape) => void;
}

const tableTypes = [
  {
    type: "square" as TableShape,
    label: "Square",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="8" y="8" width="24" height="24" rx="2" />
      </svg>
    ),
  },
  {
    type: "circle" as TableShape,
    label: "Circle",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="20" cy="20" r="12" />
      </svg>
    ),
  },
  {
    type: "rectangle-h" as TableShape,
    label: "Rectangle H",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="6" y="14" width="28" height="12" rx="2" />
      </svg>
    ),
  },
  {
    type: "rectangle-v" as TableShape,
    label: "Rectangle V",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="14" y="6" width="12" height="28" rx="2" />
      </svg>
    ),
  },
];

export function TableTypeSelector({
  selectedType,
  onSelectType,
}: TableTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">TABLE TYPES</h3>
      <div className="grid grid-cols-2 gap-3">
        {tableTypes.map((tableType) => (
          <button
            key={tableType.type}
            onClick={() => onSelectType(tableType.type)}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all hover:border-gray-400",
              selectedType === tableType.type
                ? "border-black bg-gray-50"
                : "border-gray-200 bg-white",
            )}
          >
            <div className="mb-2">{tableType.icon}</div>
            <span className="text-sm font-medium">{tableType.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
