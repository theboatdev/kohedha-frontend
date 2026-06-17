"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VendorLayout } from "@/components/vendors/vendor-layout";
import {
  CreateEventDialog,
  type NewEventData,
} from "@/components/vendors/create-event-dialog";
import { DeleteConfirmationDialog } from "@/components/vendors/delete-confirmation-dialog";
import {
  EventCard,
  type EventItem,
  type EventStatus,
} from "@/components/vendors/event-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Search, Filter, Plus, Ticket } from "lucide-react";
import { signOutVendor } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  createEvent,
  getVendorEvents,
  getEventById,
  deleteEvent,
  updateEvent,
  type Event,
} from "@/lib/events";

const initialEvents: EventItem[] = [];

// Helper function to transform backend Event to frontend EventItem
function transformEvent(backendEvent: Event): EventItem {
  return {
    id: backendEvent._id,
    title: backendEvent.eventName,
    date: backendEvent.eventDate,
    startTime: backendEvent.eventTime,
    endTime: backendEvent.eventEndDate,
    location: backendEvent.location,
    capacity: backendEvent.maxCapacity,
    ticketsSold: 0,
    price: backendEvent.ticketPrice,
    status:
      backendEvent.status === "upcoming"
        ? ("draft" as EventStatus)
        : (backendEvent.status as EventStatus),
    description: backendEvent.description || "",
    imageUrl: backendEvent.images?.[0]?.url,
  };
}

// Helper function to transform frontend EventItem to backend CreateEventData
function transformToBackendEvent(frontendEvent: NewEventData) {
  return {
    eventName: frontendEvent.eventName,
    description: frontendEvent.description,
    category: frontendEvent.category,
    eventDate: frontendEvent.eventDate,
    eventEndDate: frontendEvent.eventEndDate,
    eventTime: frontendEvent.eventTime,
    maxCapacity: Number(frontendEvent.maxCapacity),
    location: frontendEvent.location,
    ticketPrice: Number(frontendEvent.ticketPrice || 0),
    tags: frontendEvent.tags
      ? frontendEvent.tags.split(",").map((tag) => tag.trim())
      : [],
    imageFile: frontendEvent.imageFile,
    existingImages: frontendEvent.existingImages || [],
  };
}

export default function EventsManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Load events on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getVendorEvents();
        const transformedEvents = result.data.map(transformEvent);
        setEvents(transformedEvents);
      } catch (err) {
        console.error("Failed to load events:", err);
        setError("Failed to load events. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load events. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutVendor();
      router.push("/vendors/login");
    } catch (error) {
      console.error("Sign out error:", error);
      router.push("/vendors/login");
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const totalSales = events.reduce(
      (sum, event) => sum + event.ticketsSold,
      0,
    );

    return {
      total: events.length,
      totalSales,
    };
  }, [events]);

  const handleCreateEvent = async (data: NewEventData) => {
    try {
      const backendData = transformToBackendEvent(data);
      const result = await createEvent(backendData);

      if (result.success && result.data) {
        const transformedEvent = transformEvent(result.data);
        setEvents((previous) => [transformedEvent, ...previous]);
        setIsDialogOpen(false);
        toast({
          title: "Event Created",
          description: "Your event has been created successfully.",
        });
      }
    } catch (err) {
      console.error("Failed to create event:", err);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, status: EventStatus) => {
    try {
      // Map frontend status to backend status
      const backendStatus = status === "draft" ? "upcoming" : status;
      const result = await updateEvent(id, {
        status: backendStatus as import("@/lib/events").EventStatus,
      });

      if (result.success) {
        setEvents((previous) =>
          previous.map((event) =>
            event.id === id ? { ...event, status } : event,
          ),
        );
        toast({
          title: "Status Updated",
          description: `Event status changed to ${status}.`,
        });
      }
    } catch (err) {
      console.error("Failed to update event status:", err);
      toast({
        title: "Error",
        description: "Failed to update event status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    setEventToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      const result = await deleteEvent(eventToDelete);

      if (result.success) {
        setEvents((previous) =>
          previous.filter((event) => event.id !== eventToDelete),
        );
        setEventToDelete(null);
        toast({
          title: "Event Deleted",
          description: "The event has been removed.",
        });
      }
    } catch (err) {
      console.error("Failed to delete event:", err);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (id: string) => {
    try {
      // Fetch full event data from backend to get all fields including category and tags
      const result = await getEventById(id);
      if (result.success && result.data) {
        const event = events.find((e) => e.id === id);
        if (event) {
          // Store both the EventItem and full backend data
          setEditingEvent({ ...event, backendData: result.data } as any);
          setIsDialogOpen(true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch event details:", err);
      toast({
        title: "Error",
        description: "Failed to load event details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEvent = async (data: NewEventData) => {
    if (!editingEvent) return;

    try {
      const backendData = transformToBackendEvent(data);
      const result = await updateEvent(editingEvent.id, backendData);

      if (result.success && result.data) {
        const transformedEvent = transformEvent(result.data);
        setEvents((previous) =>
          previous.map((event) =>
            event.id === editingEvent.id ? transformedEvent : event,
          ),
        );
        setIsDialogOpen(false);
        setEditingEvent(null);
        toast({
          title: "Event Updated",
          description: "Your event has been updated successfully.",
        });
      }
    } catch (err) {
      console.error("Failed to update event:", err);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <VendorLayout onSignOut={handleSignOut} pageTitle="Manage Events">
      <div style={{ minHeight: "100vh", background: "#F5F5F5" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
            <div className="flex items-center gap-4 flex-1">
              <div
                className="flex items-center gap-3 px-6 py-3 rounded-full h-12 whitespace-nowrap"
                style={{ background: "#2A2620", border: "1px solid #2A2620" }}
              >
                <CalendarDays
                  className="w-5 h-5"
                  style={{ color: "#F2EEE6" }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "#F2EEE6" }}
                >
                  {stats.total}{" "}
                  <span style={{ color: "#DDD9CE" }}>Total Events</span>
                </span>
              </div>
            </div>

            <Button
              onClick={() => setIsDialogOpen(true)}
              className="h-12 font-poppins font-medium md:w-auto w-full"
              style={{
                background: "#C4724A",
                color: "#F2EEE6",
                borderRadius: "40px",
                padding: "13px 28px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#B85E38")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#C4724A")
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>

          <div
            className="rounded-xl shadow-lg overflow-hidden"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(42,38,32,0.1)",
            }}
          >
            <div
              className="p-8"
              style={{ borderBottom: "1px solid rgba(42,38,32,0.1)" }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: "#7A7368" }}
                  />
                  <Input
                    placeholder="Search by title, event ID, or location..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="pl-10 font-poppins"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[220px] font-poppins">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <div
                    className="inline-block animate-spin rounded-full border-b-2 w-8 h-8 mb-4"
                    style={{ borderColor: "#C4724A" }}
                  ></div>
                  <p className="font-poppins" style={{ color: "#7A7368" }}>
                    Loading events...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <CalendarDays
                    className="h-12 w-12 mx-auto mb-4"
                    style={{ color: "#DDD9CE" }}
                  />
                  <p className="font-poppins mb-4" style={{ color: "#C4724A" }}>
                    {error}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="font-poppins"
                    style={{
                      background: "#C4724A",
                      color: "#F2EEE6",
                      borderRadius: "40px",
                      padding: "13px 28px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#B85E38")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#C4724A")
                    }
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarDays
                    className="h-12 w-12 mx-auto mb-4"
                    style={{ color: "#DDD9CE" }}
                  />
                  <p className="font-poppins" style={{ color: "#7A7368" }}>
                    No events found
                  </p>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateEventDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingEvent(null);
        }}
        onCreateEvent={editingEvent ? handleUpdateEvent : handleCreateEvent}
        initialData={
          editingEvent && (editingEvent as any).backendData
            ? {
                eventName: (editingEvent as any).backendData.eventName,
                description:
                  (editingEvent as any).backendData.description || "",
                category: (editingEvent as any).backendData.category,
                eventDate:
                  (editingEvent as any).backendData.eventDate?.split("T")[0] ||
                  (editingEvent as any).backendData.eventDate,
                eventEndDate:
                  (editingEvent as any).backendData.eventEndDate?.split(
                    "T",
                  )[0] || (editingEvent as any).backendData.eventEndDate,
                eventTime: (editingEvent as any).backendData.eventTime,
                maxCapacity: String(
                  (editingEvent as any).backendData.maxCapacity,
                ),
                location: (editingEvent as any).backendData.location,
                ticketPrice: String(
                  (editingEvent as any).backendData.ticketPrice,
                ),
                tags: (editingEvent as any).backendData.tags?.join(", ") || "",
                existingImages: (editingEvent as any).backendData.images || [],
              }
            : undefined
        }
        isEditing={!!editingEvent}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteEvent}
        title="Delete Event?"
        description="Are you sure you want to delete this event? This action cannot be undone and all event data will be permanently removed."
        confirmText="Delete Event"
        cancelText="Cancel"
      />
    </VendorLayout>
  );
}
