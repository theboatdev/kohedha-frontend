import { useCallback } from "react";
import { updateTablePositions as apiUpdateTablePositions } from "@/lib/tables";

export interface TablePosition {
  x: number;
  y: number;
}

export interface PositionedTable {
  id: string;
  x: number;
  y: number;
}

/**
 * Custom hook to manage table positions in database
 */
export function useTablePositions() {
  /**
   * Save table positions to database (bulk update)
   */
  const savePositionsToDB = useCallback(
    async (positions: Array<{ id: string; x: number; y: number }>) => {
      try {
        const formattedPositions = positions.map((pos) => ({
          id: pos.id,
          positionX: pos.x,
          positionY: pos.y,
        }));

        await apiUpdateTablePositions(formattedPositions);
      } catch (error) {
        console.error("Failed to save positions to database:", error);
        throw error;
      }
    },
    [],
  );

  /**
   * Find the next available position in a grid layout for a new table
   * Checks existing tables to avoid overlapping
   */
  const findNextAvailablePosition = useCallback(
    (existingTables: PositionedTable[]): TablePosition => {
      // Grid configuration
      const gridSpacingX = 200;
      const gridSpacingY = 200;
      const startX = 100;
      const startY = 100;
      const maxColumns = 4;

      // Find all occupied positions (rounded to 50px grid for collision detection)
      const occupiedPositions = new Set(
        existingTables.map(
          (t) => `${Math.round(t.x / 50)},${Math.round(t.y / 50)}`,
        ),
      );

      // Find next available grid position
      let row = 0;
      let col = 0;
      while (true) {
        const x = startX + col * gridSpacingX;
        const y = startY + row * gridSpacingY;
        const posKey = `${Math.round(x / 50)},${Math.round(y / 50)}`;

        if (!occupiedPositions.has(posKey)) {
          return { x, y };
        }

        col++;
        if (col >= maxColumns) {
          col = 0;
          row++;
        }
      }
    },
    [],
  );

  return {
    savePositionsToDB,
    findNextAvailablePosition,
  };
}
