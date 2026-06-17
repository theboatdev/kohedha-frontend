"use client";

import { useRef, useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableShape } from "./table-type-selector";

export interface CanvasTable {
  id: string;
  tableNumber: string;
  capacity: number;
  shape: TableShape;
  x: number;
  y: number;
}

interface TableCanvasProps {
  tables: CanvasTable[];
  backgroundColor: string;
  onTableMove: (id: string, x: number, y: number) => void;
  onAddTable: () => void;
  onDeleteTable?: (id: string) => void;
  onTableClick?: (id: string) => void;
  centerTrigger?: number;
  disabled?: boolean;
}

export function TableCanvas({
  tables,
  backgroundColor,
  onTableMove,
  onAddTable,
  onDeleteTable,
  onTableClick,
  centerTrigger,
  disabled = false,
}: TableCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    if (centerTrigger && canvasRef.current) {
      setPan({ x: 0, y: 0 });
      setScale(1);
    }
  }, [centerTrigger]);

  const handleMouseDown = (
    e: React.MouseEvent,
    tableId: string,
    tableX: number,
    tableY: number,
  ) => {
    if (disabled) return;
    e.preventDefault();

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - tableX,
        y: e.clientY - rect.top - tableY,
      });
    }

    setDraggingTable(tableId);
    setHasMoved(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingTable && canvasRef.current && !disabled) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      onTableMove(draggingTable, newX, newY);
      setHasMoved(true);
    }
  };

  const handleMouseUp = (tableId?: string) => {
    if (draggingTable && !hasMoved && onTableClick && tableId) {
      // It was a click, not a drag
      onTableClick(tableId);
    }
    setDraggingTable(null);
    setHasMoved(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, tableId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDeleteTable && !disabled) {
      onDeleteTable(tableId);
    }
  };

  const getTableIcon = (shape: TableShape, capacity: number) => {
    const commonClasses =
      "absolute inset-0 flex flex-col items-center justify-center";

    switch (shape) {
      case "square":
        return (
          <div className="w-24 h-24 relative">
            <div
              className={cn(
                commonClasses,
                "border-2 border-gray-800 rounded-lg bg-white",
              )}
            >
              <span className="text-xs font-semibold text-gray-600">
                {capacity}
              </span>
            </div>
          </div>
        );
      case "circle":
        return (
          <div className="w-24 h-24 relative">
            <div
              className={cn(
                commonClasses,
                "border-2 border-gray-800 rounded-full bg-white",
              )}
            >
              <span className="text-xs font-semibold text-gray-600">
                {capacity}
              </span>
            </div>
          </div>
        );
      case "rectangle-h":
        return (
          <div className="w-36 h-20 relative">
            <div
              className={cn(
                commonClasses,
                "border-2 border-gray-800 rounded-lg bg-white",
              )}
            >
              <span className="text-xs font-semibold text-gray-600">
                {capacity}
              </span>
            </div>
          </div>
        );
      case "rectangle-v":
        return (
          <div className="w-20 h-36 relative">
            <div
              className={cn(
                commonClasses,
                "border-2 border-gray-800 rounded-lg bg-white",
              )}
            >
              <span className="text-xs font-semibold text-gray-600">
                {capacity}
              </span>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-24 h-24 relative">
            <div
              className={cn(
                commonClasses,
                "border-2 border-gray-800 rounded-lg bg-white",
              )}
            >
              <span className="text-xs font-semibold text-gray-600">
                {capacity}
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={canvasRef}
        className={cn(
          "w-full h-full overflow-hidden",
          disabled ? "cursor-not-allowed" : "cursor-move",
        )}
        style={{ backgroundColor }}
        onMouseMove={handleMouseMove}
        onMouseUp={() => handleMouseUp()}
        onMouseLeave={() => handleMouseUp()}
      >
        {disabled && (
          <div className="absolute inset-0 bg-gray-900/10 z-10 flex items-center justify-center">
            <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-center">
              <p className="text-lg font-semibold text-gray-800">
                Select a section to view and manage tables
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Use the section selector on the left to get started
              </p>
            </div>
          </div>
        )}
        <div
          className="relative w-full h-full"
          style={{
            transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: "center center",
          }}
        >
          {tables.map((table) => (
            <div
              key={table.id}
              className={cn(
                "absolute transition-shadow hover:shadow-lg",
                !disabled && "cursor-grab active:cursor-grabbing",
                draggingTable === table.id && "shadow-2xl",
              )}
              style={{
                left: `${table.x}px`,
                top: `${table.y}px`,
              }}
              onMouseDown={(e) =>
                handleMouseDown(e, table.id, table.x, table.y)
              }
              onMouseUp={() => handleMouseUp(table.id)}
              onMouseEnter={() => setHoveredTable(table.id)}
              onMouseLeave={() => setHoveredTable(null)}
            >
              <div className="relative group">
                {getTableIcon(table.shape, table.capacity)}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                  {table.tableNumber}
                </div>
                {/* Delete button on hover */}
                {onDeleteTable && hoveredTable === table.id && !disabled && (
                  <button
                    onClick={(e) => handleDeleteClick(e, table.id)}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg z-10"
                    title="Delete table"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Table Button */}
      <button
        onClick={onAddTable}
        disabled={disabled}
        className={cn(
          "absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center transition-all shadow-lg",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-50 hover:border-gray-400",
        )}
        title={disabled ? "Select a section first" : "Add table"}
      >
        <Plus className="h-6 w-6 text-gray-700" />
      </button>
    </div>
  );
}
