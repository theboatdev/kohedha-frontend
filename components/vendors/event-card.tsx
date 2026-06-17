import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Ticket,
  Edit,
  Trash2,
  ImageOff,
} from "lucide-react";

export type EventStatus = "draft" | "published" | "completed" | "cancelled";

export type EventItem = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  capacity: number;
  ticketsSold: number;
  price: number;
  status: EventStatus;
  description?: string;
  imageUrl?: string;
};

type EventCardProps = {
  event: EventItem;
  onStatusChange: (id: string, status: EventStatus) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const statusConfig: Record<
  EventStatus,
  { label: string; dot: string; badge: string }
> = {
  draft: {
    label: "Upcoming",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  published: {
    label: "Published",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Completed",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
};

export function EventCard({
  event,
  onStatusChange,
  onEdit,
  onDelete,
}: EventCardProps) {
  const isFreeEvent = event.price === 0;

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const cfg = statusConfig[event.status];

  return (
    <div className="group flex bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-200 w-full">
      {/* Image panel */}
      <div className="hidden sm:block relative w-44 lg:w-52 flex-shrink-0 bg-gray-50">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <ImageOff className="w-7 h-7" />
            <span className="text-xs font-poppins">No image</span>
          </div>
        )}
        {/* Price pill overlaid on image */}
        <div className="absolute bottom-2 left-2">
          <span className="font-poppins text-xs font-semibold bg-black/70 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            {isFreeEvent ? "Free" : `LKR ${event.price.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 p-5 gap-3">
        {/* Top row: title + status + actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}
              />
              <span
                className={`font-poppins text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.badge}`}
              >
                {cfg.label}
              </span>
              {isFreeEvent && (
                <span className="font-poppins text-xs font-medium px-2 py-0.5 rounded-full border bg-violet-50 text-violet-700 border-violet-200">
                  Free
                </span>
              )}
            </div>
            <h3 className="font-poppins font-semibold text-base text-gray-900 leading-snug truncate">
              {event.title}
            </h3>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onEdit(event.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Edit event"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <p className="font-poppins text-xs text-gray-500 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Meta chips */}
        <div className="flex flex-wrap items-center gap-3 mt-auto">
          <div className="flex items-center gap-1.5 text-gray-500">
            <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-poppins text-xs">{formattedDate}</span>
          </div>
          <div className="w-px h-3 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock3 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-poppins text-xs">
              {formatTime(event.startTime)}
            </span>
          </div>
          <div className="w-px h-3 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-gray-500 min-w-0">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-poppins text-xs truncate">
              {event.location}
            </span>
          </div>
          <div className="w-px h-3 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-gray-500">
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-poppins text-xs">
              {event.capacity} capacity
            </span>
          </div>
          {/* Mobile price */}
          <div className="sm:hidden flex items-center gap-1.5 text-gray-500">
            <div className="w-px h-3 bg-gray-200" />
            <Ticket className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-poppins text-xs font-medium">
              {isFreeEvent ? "Free" : `LKR ${event.price.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
