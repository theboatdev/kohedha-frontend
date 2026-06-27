import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { Table, TableType, CreateTableData } from "@/lib/tables";

type CreateTableDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTable: (data: CreateTableData) => void;
  onUpdateTable?: (id: string, data: CreateTableData) => void;
  editingTable?: Table | null;
  isLoading?: boolean;
};

const tableTypes: { value: TableType; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
];

export function CreateTableDialog({
  open,
  onOpenChange,
  onCreateTable,
  onUpdateTable,
  editingTable,
  isLoading = false,
}: CreateTableDialogProps) {
  const [formData, setFormData] = useState<CreateTableData>({
    tableNumber: "",
    seatingCapacity: 2,
    tableType: "standard",
  });
  const { toast } = useToast();

  // Reset form when dialog opens/closes or when editing table changes
  useEffect(() => {
    if (open) {
      if (editingTable) {
        setFormData({
          tableNumber: editingTable.tableNumber,
          seatingCapacity: editingTable.seatingCapacity,
          tableType: editingTable.tableType,
        });
      } else {
        setFormData({
          tableNumber: "",
          seatingCapacity: 2,
          tableType: "standard",
        });
      }
    }
  }, [open, editingTable]);

  const handleSubmit = () => {
    // Validation
    if (!formData.tableNumber) {
      toast({
        title: "Validation Error",
        description: "Please enter a table number.",
        variant: "destructive",
      });
      return;
    }

    if (formData.seatingCapacity < 1) {
      toast({
        title: "Validation Error",
        description: "Seating capacity must be at least 1.",
        variant: "destructive",
      });
      return;
    }

    // Submit
    if (editingTable && onUpdateTable) {
      onUpdateTable(editingTable._id, formData);
    } else {
      onCreateTable(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-2xl">
            {editingTable ? "Edit Table" : "Add New Table"}
          </DialogTitle>
          <DialogDescription className="font-poppins text-sm">
            {editingTable
              ? "Update table information"
              : "Add a new table to your venue"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Table Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Table Number <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g. T-001, Table 5"
              value={formData.tableNumber}
              onChange={(e) =>
                setFormData({ ...formData, tableNumber: e.target.value })
              }
              className="font-poppins"
            />
            <p className="text-xs text-gray-500 font-poppins">
              Enter a unique identifier for this table
            </p>
          </div>

          {/* Seating Capacity */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Seating Capacity <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min="1"
              value={formData.seatingCapacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seatingCapacity: parseInt(e.target.value) || 1,
                })
              }
              className="font-poppins"
            />
            <p className="text-xs text-gray-500 font-poppins">
              Maximum number of guests this table can accommodate
            </p>
          </div>

          {/* Table Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Table Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.tableType}
              onValueChange={(value: TableType) =>
                setFormData({ ...formData, tableType: value })
              }
            >
              <SelectTrigger className="font-poppins">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {tableTypes.map((type) => (
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
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="font-poppins"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-black hover:bg-gray-900 text-white font-poppins"
          >
            {isLoading
              ? "Saving..."
              : editingTable
                ? "Update Table"
                : "Create Table"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
