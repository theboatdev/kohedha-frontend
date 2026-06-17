"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Armchair,
  Users,
  ToggleRight,
  Search,
  Filter,
  Plus,
  AlertCircle,
} from "lucide-react";
import { VendorLayout } from "@/components/vendors/vendor-layout";
import { StatsCard } from "@/components/vendors/stats-card";
import { TableCard } from "@/components/vendors/table-card";
import { CreateTableDialog } from "@/components/vendors/create-table-dialog";
import { DeleteConfirmationDialog } from "@/components/vendors/delete-confirmation-dialog";
import { signOutVendor } from "@/lib/auth";
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  toggleTableStatus,
  Table,
  TableType,
  CreateTableData,
} from "@/lib/tables";
import { useToast } from "@/hooks/use-toast";

export default function TablesManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [tables, setTables] = useState<Table[]>([]);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalTables: 0,
    activeTables: 0,
    inactiveTables: 0,
    totalCapacity: 0,
  });

  // Fetch tables on component mount
  useEffect(() => {
    fetchTables();
  }, []);

  // Apply filters whenever tables, search, or filters change
  useEffect(() => {
    applyFilters();
  }, [tables, searchQuery, typeFilter, statusFilter]);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getTables();

      if (response.success) {
        setTables(response.data.tables);
        setStats(response.data.stats);
      }
    } catch (error: any) {
      console.error("Error fetching tables:", error);
      const errorMessage = error.message || "Failed to fetch tables";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tables];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((table) =>
        table.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((table) => table.tableType === typeFilter);
    }

    // Status filter
    if (statusFilter === "active") {
      filtered = filtered.filter((table) => table.isActive);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((table) => !table.isActive);
    }

    setFilteredTables(filtered);
  };

  const handleCreateTable = async (data: CreateTableData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await createTable(data);

      if (response.success) {
        setIsDialogOpen(false);
        fetchTables(); // Refresh the list
        toast({
          title: "Success!",
          description: response.message || "Table created successfully!",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Error creating table:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create table",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTable = async (id: string, data: CreateTableData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await updateTable(id, data);

      if (response.success) {
        setIsDialogOpen(false);
        setEditingTable(null);
        fetchTables(); // Refresh the list
        toast({
          title: "Success!",
          description: response.message || "Table updated successfully!",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Error updating table:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update table",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table);
    setIsDialogOpen(true);
  };

  const handleDeleteTable = async (id: string) => {
    setTableToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTable = async () => {
    if (!tableToDelete) return;

    try {
      const response = await deleteTable(tableToDelete);

      if (response.success) {
        fetchTables(); // Refresh the list
        toast({
          title: "Success!",
          description: response.message || "Table deleted successfully!",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Error deleting table:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete table",
        variant: "destructive",
      });
    } finally {
      setTableToDelete(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await toggleTableStatus(id);

      if (response.success) {
        fetchTables(); // Refresh the list
        toast({
          description: response.message,
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Error toggling table status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to toggle table status",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutVendor();
      router.push("/vendors/login");
    } catch (error) {
      console.error("Sign out error:", error);
      router.push("/vendors/login");
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingTable(null);
    }
  };

  return (
    <VendorLayout onSignOut={handleSignOut} pageTitle="Table Management">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-poppins text-sm text-gray-600 mt-1">
              Manage your tables and seating arrangements
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="h-12 bg-black hover:bg-gray-900 text-white font-poppins font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Table
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={Armchair}
            value={stats.totalTables}
            label="Total Tables"
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatsCard
            icon={ToggleRight}
            value={stats.activeTables}
            label="Active Tables"
            iconBgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatsCard
            icon={AlertCircle}
            value={stats.inactiveTables}
            label="Inactive Tables"
            iconBgColor="bg-red-50"
            iconColor="text-red-600"
          />
          <StatsCard
            icon={Users}
            value={stats.totalCapacity}
            label="Total Capacity"
            iconBgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by table number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-poppins"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48 font-poppins">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Table Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-poppins">
                All Types
              </SelectItem>
              <SelectItem value="standard" className="font-poppins">
                Standard
              </SelectItem>
              <SelectItem value="indoor" className="font-poppins">
                Indoor
              </SelectItem>
              <SelectItem value="outdoor" className="font-poppins">
                Outdoor
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 font-poppins">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-poppins">
                All Status
              </SelectItem>
              <SelectItem value="active" className="font-poppins">
                Active
              </SelectItem>
              <SelectItem value="inactive" className="font-poppins">
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-poppins text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Tables List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="font-poppins text-gray-600">Loading tables...</p>
            </div>
          ) : filteredTables.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <Armchair className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="font-poppins text-gray-600 mb-2">
                {tables.length === 0
                  ? "No tables yet"
                  : "No tables match your filters"}
              </p>
              <p className="font-poppins text-sm text-gray-500">
                {tables.length === 0
                  ? "Add your first table to start managing reservations"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            filteredTables.map((table) => (
              <TableCard
                key={table._id}
                table={table}
                onEdit={handleEditTable}
                onDelete={handleDeleteTable}
                onToggleStatus={handleToggleStatus}
              />
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Table Dialog */}
      <CreateTableDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onCreateTable={handleCreateTable}
        onUpdateTable={handleUpdateTable}
        editingTable={editingTable}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteTable}
        title="Delete Table"
        description="Are you sure you want to delete this table? This action cannot be undone."
        confirmText="Delete Table"
      />
    </VendorLayout>
  );
}
