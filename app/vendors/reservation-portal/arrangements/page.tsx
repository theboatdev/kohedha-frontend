"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { List, Plus } from "lucide-react";
import { ReservationPortalLayout } from "@/components/vendors/reservation-portal-layout";
import {
  TableTypeSelector,
  TableShape,
} from "@/components/vendors/table-type-selector";
import { CanvasControls } from "@/components/vendors/canvas-controls";
import { TableCanvas, CanvasTable } from "@/components/vendors/table-canvas";
import { SectionListDialog } from "@/components/vendors/section-list-dialog";
import { CreateSectionDialog } from "@/components/vendors/create-section-dialog";
import { EditTableDialog } from "@/components/vendors/edit-table-dialog";
import { AddTableDialog } from "@/components/vendors/add-table-dialog";
import { DeleteConfirmationDialog } from "@/components/vendors/delete-confirmation-dialog";
import { getTables, createTable, deleteTable, Table } from "@/lib/tables";
import { getSections, createSection } from "@/lib/sections";
import { useToast } from "@/hooks/use-toast";
import { useTablePositions } from "@/hooks/use-table-positions";

export default function ArrangementsPage() {
  const { toast } = useToast();
  const { savePositionsToDB, findNextAvailablePosition } = useTablePositions();

  // State
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [selectedTableType, setSelectedTableType] = useState<TableShape | null>(
    null,
  );
  const [backgroundColor, setBackgroundColor] = useState("rgb(240,240,240");
  const [centerTrigger, setCenterTrigger] = useState(0);
  const [canvasTables, setCanvasTables] = useState<CanvasTable[]>([]);
  const [sectionListOpen, setSectionListOpen] = useState(false);
  const [createSectionOpen, setCreateSectionOpen] = useState(false);
  const [addTableDialogOpen, setAddTableDialogOpen] = useState(false);
  const [editTableDialogOpen, setEditTableDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);
  const [allTables, setAllTables] = useState<Table[]>([]);
  const [sectionsCount, setSectionsCount] = useState(0);
  const [totalTables, setTotalTables] = useState(0);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Ref for debouncing position saves
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingPositionsRef = useRef<Map<string, { x: number; y: number }>>(
    new Map(),
  );

  useEffect(() => {
    fetchData();
  }, [selectedSectionId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        // Save any pending positions before unmounting
        if (pendingPositionsRef.current.size > 0) {
          savePendingPositions();
        }
      }
    };
  }, []);

  const savePendingPositions = async () => {
    if (pendingPositionsRef.current.size === 0) return;

    try {
      const positions = Array.from(pendingPositionsRef.current.entries()).map(
        ([id, pos]) => ({
          id,
          x: pos.x,
          y: pos.y,
        }),
      );

      await savePositionsToDB(positions);
      pendingPositionsRef.current.clear();
    } catch (error) {
      console.error("Failed to save positions:", error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch tables (filtered by section if selected)
      const tablesResponse = await getTables(selectedSectionId || undefined);
      if (tablesResponse.success) {
        setTotalTables(tablesResponse.data.stats.totalTables);
        setTotalCapacity(tablesResponse.data.stats.totalCapacity);
        setAllTables(tablesResponse.data.tables);

        // Convert tables to canvas tables
        const converted: CanvasTable[] = [];
        const tablesWithPositions: CanvasTable[] = [];

        // First pass: add tables with saved positions from database
        tablesResponse.data.tables.forEach((table) => {
          if (
            table.positionX !== null &&
            table.positionX !== undefined &&
            table.positionY !== null &&
            table.positionY !== undefined
          ) {
            const canvasTable: CanvasTable = {
              id: table._id,
              tableNumber: table.tableNumber,
              capacity: table.seatingCapacity,
              shape: table.shape || "square",
              x: table.positionX,
              y: table.positionY,
            };
            converted.push(canvasTable);
            tablesWithPositions.push(canvasTable);
          }
        });

        // Second pass: add new tables without saved positions
        tablesResponse.data.tables.forEach((table) => {
          if (
            table.positionX === null ||
            table.positionX === undefined ||
            table.positionY === null ||
            table.positionY === undefined
          ) {
            const newPos = findNextAvailablePosition(tablesWithPositions);
            const canvasTable: CanvasTable = {
              id: table._id,
              tableNumber: table.tableNumber,
              capacity: table.seatingCapacity,
              shape: table.shape || "square",
              x: newPos.x,
              y: newPos.y,
            };
            converted.push(canvasTable);
            tablesWithPositions.push(canvasTable);

            // Save the new position to database
            pendingPositionsRef.current.set(table._id, {
              x: newPos.x,
              y: newPos.y,
            });
          }
        });

        setCanvasTables(converted);

        // Save any new positions to database
        if (pendingPositionsRef.current.size > 0) {
          await savePendingPositions();
        }
      }

      // Fetch sections count
      const sectionsResponse = await getSections(true);
      if (sectionsResponse.success) {
        setSectionsCount(sectionsResponse.count);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch data",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableMove = (id: string, x: number, y: number) => {
    // Update local state immediately for smooth UI
    setCanvasTables((prev) =>
      prev.map((table) => (table.id === id ? { ...table, x, y } : table)),
    );

    // Add to pending positions
    pendingPositionsRef.current.set(id, { x, y });

    // Debounce the save to database
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      savePendingPositions();
    }, 500); // Save after 500ms of inactivity
  };

  const handleAddTable = () => {
    if (!selectedTableType) {
      toast({
        title: "No table type selected",
        description: "Please select a table type first",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    if (!selectedSectionId) {
      toast({
        title: "No section selected",
        description: "Please select a section to add tables",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    setAddTableDialogOpen(true);
  };

  const handleTypeSelect = (type: TableShape) => {
    setSelectedTableType(type);

    if (!selectedSectionId) {
      toast({
        title: "No section selected",
        description: "Please select a section before adding tables",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    setAddTableDialogOpen(true);
  };

  const handleAddTableSubmit = async (data: {
    tableNumber: string;
    seatingCapacity: number;
    shape: TableShape;
  }) => {
    if (!selectedSectionId) return;

    try {
      setIsSaving(true);

      const newTableData = {
        tableNumber: data.tableNumber,
        seatingCapacity: data.seatingCapacity,
        sectionId: selectedSectionId,
        shape: data.shape,
      };

      const response = await createTable(newTableData);

      if (response.success && response.data) {
        toast({
          title: "Table added",
          description: "Table created successfully",
          duration: 3000,
        });

        // Refresh data to update the canvas
        await fetchData();
      }
    } catch (error: any) {
      console.error("Error creating table:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create table",
        variant: "destructive",
        duration: 4000,
      });
      throw error; // Propagate error to dialog
    } finally {
      setIsSaving(false);
    }
  };

  const handleTableClick = (tableId: string) => {
    const table = allTables.find((t) => t._id === tableId);
    if (table) {
      setSelectedTable(table);
      setEditTableDialogOpen(true);
    }
  };

  const handleEditTableSuccess = async () => {
    await fetchData();
    setSelectedTable(null);
  };

  const handleDeleteClick = (id: string) => {
    setTableToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tableToDelete) return;

    try {
      await deleteTable(tableToDelete);

      // Remove from local state
      setCanvasTables((prev) =>
        prev.filter((table) => table.id !== tableToDelete),
      );

      // Remove from pending positions if exists
      pendingPositionsRef.current.delete(tableToDelete);

      // Clear selected table if it was the one being deleted
      if (selectedTable?._id === tableToDelete) {
        setSelectedTable(null);
        setEditTableDialogOpen(false);
      }

      toast({
        title: "Table deleted",
        description: "Table has been removed successfully",
        duration: 3000,
      });

      await fetchData();
    } catch (error: any) {
      console.error("Error deleting table:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete table",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setTableToDelete(null);
    }
  };

  const handleCenterView = () => {
    setCenterTrigger((prev) => prev + 1);
  };

  const handleCreateSection = async (data: any) => {
    try {
      const response = await createSection(data);
      if (response.success) {
        await fetchData();
        setCreateSectionOpen(false);
        toast({
          title: "Success",
          description: "Section created successfully",
          duration: 3000,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create section",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  return (
    <ReservationPortalLayout pageTitle="Arrangements">
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          {/* Table Options Section */}
          <div className="space-y-4 mb-6 pb-6 border-b">
            <h2 className="font-bold text-xl">TABLE OPTIONS</h2>
            <p className="text-sm text-gray-600">
              {selectedSectionId
                ? "Easily click on your preffered table type, name them, pick your maximum covers counts, & arrange them as your preference."
                : "Select a section to start adding tables."}
            </p>
            {!selectedSectionId && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 font-medium">
                  ⚠️ No section selected
                </p>
              </div>
            )}
            <p className="text-sm font-medium text-gray-700">
              {totalTables} tables · {totalCapacity} total pax
            </p>
          </div>

          {/* Table Types */}
          <div className="mb-6">
            <TableTypeSelector
              selectedType={selectedTableType}
              onSelectType={handleTypeSelect}
            />
          </div>

          {/* Section Management */}
          <div className="space-y-3 mb-6 pb-6 border-b">
            <h3 className="font-semibold text-lg">SECTION MANAGEMENT</h3>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setSectionListOpen(true)}
            >
              <span className="flex items-center gap-2">
                <List className="h-4 w-4" />
                View & Select Sections
              </span>
              <span className="bg-gray-200 px-2 py-0.5 rounded text-sm font-medium">
                {sectionsCount}
              </span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => setCreateSectionOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          {/* Canvas Controls */}
          <CanvasControls
            backgroundColor={backgroundColor}
            onBackgroundColorChange={setBackgroundColor}
          />
        </div>

        {/* Right Panel - Canvas */}
        <div className="flex-1 bg-gray-50 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tables...</p>
              </div>
            </div>
          ) : (
            <div className="h-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <TableCanvas
                tables={canvasTables}
                backgroundColor={backgroundColor}
                onTableMove={handleTableMove}
                onAddTable={handleAddTable}
                onDeleteTable={handleDeleteClick}
                onTableClick={handleTableClick}
                centerTrigger={centerTrigger}
                disabled={!selectedSectionId}
              />
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <SectionListDialog
        open={sectionListOpen}
        onOpenChange={setSectionListOpen}
        selectedSectionId={selectedSectionId}
        onSelectSection={setSelectedSectionId}
      />
      <CreateSectionDialog
        isOpen={createSectionOpen}
        onClose={() => setCreateSectionOpen(false)}
        onSubmit={handleCreateSection}
      />
      <AddTableDialog
        open={addTableDialogOpen}
        onOpenChange={setAddTableDialogOpen}
        onSubmit={handleAddTableSubmit}
        selectedShape={selectedTableType}
      />
      <EditTableDialog
        table={selectedTable}
        open={editTableDialogOpen}
        onOpenChange={setEditTableDialogOpen}
        onSuccess={handleEditTableSuccess}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Table?"
        description="Are you sure you want to delete this table? This action cannot be undone and will remove the table from your arrangements."
        confirmText="Delete Table"
      />
    </ReservationPortalLayout>
  );
}
