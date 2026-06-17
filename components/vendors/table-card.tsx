import { Button } from "@/components/ui/button";
import {
  Armchair,
  Users,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Table, TableType } from "@/lib/tables";

type TableCardProps = {
  table: Table;
  onEdit: (table: Table) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
};

const getTableTypeColor = (type: TableType) => {
  switch (type) {
    case "indoor":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "outdoor":
      return "bg-green-50 text-green-700 border-green-200";
    case "standard":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getTableTypeIcon = (type: TableType) => {
  return <Armchair className="h-4 w-4" />;
};

export function TableCard({
  table,
  onEdit,
  onDelete,
  onToggleStatus,
}: TableCardProps) {
  return (
    <div
      className={`border rounded-lg p-6 transition-all duration-200 ${
        table.isActive
          ? "border-gray-200 hover:shadow-md bg-white"
          : "border-gray-200 bg-gray-50 opacity-75"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="font-poppins font-semibold text-lg text-gray-900">
                  {table.tableNumber}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium font-poppins border ${getTableTypeColor(
                    table.tableType,
                  )}`}
                >
                  {getTableTypeIcon(table.tableType)}
                  {table.tableType.charAt(0).toUpperCase() +
                    table.tableType.slice(1)}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium font-poppins border ${
                    table.isActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {table.isActive ? (
                    <ToggleRight className="h-4 w-4" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                  {table.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="font-poppins text-sm text-gray-700">
                Capacity: {table.seatingCapacity}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:ml-4">
          <Button
            onClick={() => onEdit(table)}
            variant="outline"
            size="sm"
            className="w-full lg:w-32 font-poppins text-sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>

          <Button
            onClick={() => onToggleStatus(table._id)}
            variant="outline"
            size="sm"
            className={`w-full lg:w-32 font-poppins text-sm ${
              table.isActive
                ? "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                : "border-green-300 text-green-700 hover:bg-green-50"
            }`}
          >
            {table.isActive ? (
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
            onClick={() => onDelete(table._id)}
            variant="outline"
            size="sm"
            className="w-full lg:w-32 font-poppins text-sm border-red-300 text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
