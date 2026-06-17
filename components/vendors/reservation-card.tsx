import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
} from "lucide-react";

type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

type ReservationCardProps = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  tableNumber?: string;
  specialRequests?: string;
  createdBy: "customer" | "vendor";
  onStatusChange: (id: string, newStatus: ReservationStatus) => void;
};

const getStatusColor = (status: ReservationStatus) => {
  switch (status) {
    case "confirmed":
      return "bg-green-50 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    case "completed":
      return "bg-blue-50 text-blue-700 border-blue-200";
  }
};

const getStatusIcon = (status: ReservationStatus) => {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <AlertCircle className="h-4 w-4" />;
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
  }
};

export function ReservationCard({
  id,
  customerName,
  customerEmail,
  customerPhone,
  date,
  time,
  guests,
  status,
  tableNumber,
  specialRequests,
  createdBy,
  onStatusChange,
}: ReservationCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-poppins font-semibold text-lg text-gray-900">
                  {customerName}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium font-poppins border ${getStatusColor(
                    status,
                  )}`}
                >
                  {getStatusIcon(status)}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                {createdBy === "vendor" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium font-poppins bg-purple-50 text-purple-700 border border-purple-200">
                    Created by you
                  </span>
                )}
              </div>
              <p className="font-poppins text-sm text-gray-500 mb-1">
                ID: {id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="font-poppins text-sm text-gray-700">
                {new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="font-poppins text-sm text-gray-700">{time}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="font-poppins text-sm text-gray-700">
                {guests} guests
              </span>
            </div>

            {tableNumber && (
              <div className="flex items-center gap-2">
                <span className="font-poppins text-sm font-medium text-gray-500">
                  Table:
                </span>
                <span className="font-poppins text-sm text-gray-700">
                  {tableNumber}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="font-poppins text-sm text-gray-600">
                {customerPhone}
              </span>
            </div>

            {customerEmail && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="font-poppins text-sm text-gray-600">
                  {customerEmail}
                </span>
              </div>
            )}
          </div>

          {specialRequests && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="font-poppins text-xs font-medium text-gray-700 mb-1">
                Special Requests:
              </p>
              <p className="font-poppins text-sm text-gray-600">
                {specialRequests}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-row lg:flex-col gap-2">
          {status === "pending" && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white font-poppins"
                onClick={() => onStatusChange(id, "confirmed")}
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 font-poppins"
                onClick={() => onStatusChange(id, "cancelled")}
              >
                Decline
              </Button>
            </>
          )}

          {status === "confirmed" && (
            <>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-poppins"
                onClick={() => onStatusChange(id, "completed")}
              >
                Complete
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 font-poppins"
                onClick={() => onStatusChange(id, "cancelled")}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
