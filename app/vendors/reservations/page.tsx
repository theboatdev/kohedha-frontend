"use client";

import { useState } from "react";
import Link from "next/link";
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
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { VendorLayout } from "@/components/vendors/vendor-layout";
import { StatsCard } from "@/components/vendors/stats-card";
import { ReservationCard } from "@/components/vendors/reservation-card";
import { CreateReservationDialog } from "@/components/vendors/create-reservation-dialog";
import { signOutVendor } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

type Reservation = {
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
  createdAt: string;
};

export default function ReservationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock reservations data
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "RES001",
      customerName: "Kasun Perera",
      customerEmail: "kasun@example.com",
      customerPhone: "+94712345678",
      date: "2026-02-15",
      time: "19:00",
      guests: 4,
      status: "confirmed",
      tableNumber: "T-12",
      specialRequests: "Window seat preferred",
      createdBy: "customer",
      createdAt: "2026-02-10T10:30:00",
    },
    {
      id: "RES002",
      customerName: "Nimal Silva",
      customerEmail: "nimal@example.com",
      customerPhone: "+94771234567",
      date: "2026-02-14",
      time: "20:00",
      guests: 2,
      status: "pending",
      specialRequests: "Anniversary celebration",
      createdBy: "customer",
      createdAt: "2026-02-11T14:20:00",
    },
    {
      id: "RES003",
      customerName: "Saman Fernando",
      customerEmail: "saman@example.com",
      customerPhone: "+94701234567",
      date: "2026-02-13",
      time: "18:30",
      guests: 6,
      status: "confirmed",
      tableNumber: "T-8",
      createdBy: "vendor",
      createdAt: "2026-02-09T16:45:00",
    },
    {
      id: "RES004",
      customerName: "Dilini Jayawardena",
      customerEmail: "dilini@example.com",
      customerPhone: "+94761234567",
      date: "2026-02-08",
      time: "19:30",
      guests: 3,
      status: "completed",
      tableNumber: "T-5",
      createdBy: "customer",
      createdAt: "2026-02-05T11:00:00",
    },
    {
      id: "RES005",
      customerName: "Ruwan Wijesinghe",
      customerEmail: "ruwan@example.com",
      customerPhone: "+94751234567",
      date: "2026-02-12",
      time: "18:00",
      guests: 8,
      status: "cancelled",
      specialRequests: "Birthday party",
      createdBy: "customer",
      createdAt: "2026-02-07T09:15:00",
    },
  ]);

  const handleSignOut = async () => {
    await signOutVendor();
    router.push("/vendors/login");
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.customerPhone.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    today: reservations.filter(
      (r) => r.date === new Date().toISOString().split("T")[0],
    ).length,
  };

  const handleCreateReservation = (data: any) => {
    const reservation: Reservation = {
      id: `RES${String(reservations.length + 1).padStart(3, "0")}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      date: data.date,
      time: data.time,
      guests: parseInt(data.guests),
      status: "confirmed",
      tableNumber: data.tableNumber,
      specialRequests: data.specialRequests,
      createdBy: "vendor",
      createdAt: new Date().toISOString(),
    };
    setReservations([reservation, ...reservations]);
    setIsDialogOpen(false);
    toast({
      title: "Reservation Created",
      description: `Reservation for ${reservation.customerName} has been added.`,
    });
  };

  const handleStatusChange = (id: string, newStatus: ReservationStatus) => {
    setReservations(
      reservations.map((res) =>
        res.id === id ? { ...res, status: newStatus } : res,
      ),
    );
    toast({
      title: "Status Updated",
      description: `Reservation status changed to ${newStatus}.`,
    });
  };

  return (
    <VendorLayout onSignOut={handleSignOut} pageTitle="Reservations">
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={Calendar}
              value={stats.total}
              label="Total Reservations"
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard
              icon={AlertCircle}
              value={stats.pending}
              label="Pending"
              iconBgColor="bg-yellow-50"
              iconColor="text-yellow-600"
            />
            <StatsCard
              icon={CheckCircle}
              value={stats.confirmed}
              label="Confirmed"
              iconBgColor="bg-green-50"
              iconColor="text-green-600"
            />
            <StatsCard
              icon={Clock}
              value={stats.today}
              label="Today"
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="font-bebas text-3xl tracking-tight text-gray-900 mb-2">
                    Reservation Management
                  </h2>
                  <p className="font-poppins text-sm text-gray-600">
                    Manage customer reservations and create new bookings
                  </p>
                </div>
                <CreateReservationDialog
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  onCreateReservation={handleCreateReservation}
                />
              </div>

              {/* Filters */}
              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, ID, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 font-poppins"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[200px] font-poppins">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reservations List */}
            <div className="p-8">
              {filteredReservations.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="font-poppins text-gray-500">
                    No reservations found
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      {...reservation}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <Link href="/vendors/dashboard">
              <Button
                variant="outline"
                className="font-poppins border-gray-200 hover:bg-gray-50"
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
