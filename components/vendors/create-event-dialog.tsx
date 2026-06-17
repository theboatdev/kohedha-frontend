import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type NewEventData = {
  eventName: string;
  description: string;
  category:
    | "live-music"
    | "special-dinner"
    | "promotion"
    | "theme-night"
    | "workshop"
    | "other";
  eventDate: string;
  eventEndDate?: string;
  eventTime: string;
  maxCapacity: string;
  location: string;
  ticketPrice?: string;
  tags?: string;
  // Image handling
  imageFile?: File;
  existingImages?: { url: string; uploadedAt?: string }[];
};

type CreateEventDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEvent: (data: NewEventData) => void;
  initialData?: NewEventData;
  isEditing?: boolean;
};

const initialFormData: NewEventData = {
  eventName: "",
  description: "",
  category: "other",
  eventDate: "",
  eventEndDate: "",
  eventTime: "",
  maxCapacity: "",
  location: "",
  ticketPrice: "",
  tags: "",
  imageFile: undefined,
  existingImages: [],
};

export function CreateEventDialog({
  open,
  onOpenChange,
  onCreateEvent,
  initialData,
  isEditing,
}: CreateEventDialogProps) {
  const [formData, setFormData] = useState<NewEventData>(
    initialData || initialFormData,
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.eventDate ? new Date(initialData.eventDate) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.eventEndDate ? new Date(initialData.eventEndDate) : undefined,
  );
  // Image state
  const [newImageFile, setNewImageFile] = useState<File | undefined>(undefined);
  const [newImagePreview, setNewImagePreview] = useState<string | undefined>(
    undefined,
  );
  const [existingImages, setExistingImages] = useState<
    { url: string; uploadedAt?: string }[]
  >(initialData?.existingImages || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (
      !formData.eventName ||
      !formData.description ||
      !startDate ||
      !formData.eventTime ||
      !formData.location ||
      !formData.maxCapacity
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Format dates for submission
    const submitData: NewEventData = {
      ...formData,
      eventDate: format(startDate, "yyyy-MM-dd"),
      eventEndDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      imageFile: newImageFile,
      existingImages: existingImages,
    };

    onCreateEvent(submitData);
    resetImageState();
    setFormData(initialFormData);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  function resetImageState() {
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImageFile(undefined);
    setNewImagePreview(undefined);
    setExistingImages([]);
  }

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setFormData(initialData || initialFormData);
      setStartDate(
        initialData?.eventDate ? new Date(initialData.eventDate) : undefined,
      );
      setEndDate(
        initialData?.eventEndDate
          ? new Date(initialData.eventEndDate)
          : undefined,
      );
      resetImageState();
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setStartDate(
        initialData.eventDate ? new Date(initialData.eventDate) : undefined,
      );
      setEndDate(
        initialData.eventEndDate
          ? new Date(initialData.eventEndDate)
          : undefined,
      );
      setExistingImages(initialData.existingImages || []);
      // Reset new image when switching between events
      if (newImagePreview) URL.revokeObjectURL(newImagePreview);
      setNewImageFile(undefined);
      setNewImagePreview(undefined);
    }
  }, [initialData]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="font-bebas text-2xl tracking-tight">
            {isEditing ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription className="font-poppins text-sm">
            {isEditing
              ? "Update event details."
              : "Fill in all required fields to create a new event."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Event Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Event Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g. Sunset Jazz & Dinner"
              value={formData.eventName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eventName: e.target.value,
                })
              }
              className="font-poppins"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Add a detailed event description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="font-poppins min-h-[100px]"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.category}
              onValueChange={(value: any) =>
                setFormData({
                  ...formData,
                  category: value,
                })
              }
            >
              <SelectTrigger className="font-poppins">
                <SelectValue placeholder="Select event category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="live-music">Live Music</SelectItem>
                <SelectItem value="special-dinner">Special Dinner</SelectItem>
                <SelectItem value="promotion">Promotion</SelectItem>
                <SelectItem value="theme-night">Theme Night</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Start Date <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-10 w-full justify-start text-left font-poppins font-normal rounded-md border-gray-300 bg-white hover:bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      !startDate && "text-gray-400",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                End Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-10 w-full justify-start text-left font-poppins font-normal rounded-md border-gray-300 bg-white hover:bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      !endDate && "text-gray-400",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date (optional)</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Time and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Start Time <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-10 w-full justify-start text-left font-poppins font-normal rounded-md border-gray-300 bg-white hover:bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      !formData.eventTime && "text-gray-400",
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    {formData.eventTime || <span>Select time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Select
                        value={formData.eventTime.split(":")[0] || ""}
                        onValueChange={(hour) => {
                          const minute =
                            formData.eventTime.split(":")[1] || "00";
                          setFormData({
                            ...formData,
                            eventTime: `${hour}:${minute}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-20 font-poppins">
                          <SelectValue placeholder="HH" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0");
                            return (
                              <SelectItem key={hour} value={hour}>
                                {hour}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <span className="text-xl font-bold">:</span>
                      <Select
                        value={formData.eventTime.split(":")[1] || ""}
                        onValueChange={(minute) => {
                          const hour = formData.eventTime.split(":")[0] || "00";
                          setFormData({
                            ...formData,
                            eventTime: `${hour}:${minute}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-20 font-poppins">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {Array.from({ length: 12 }, (_, i) => {
                            const minute = (i * 5).toString().padStart(2, "0");
                            return (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-xs text-gray-500 font-poppins">
                      Time in 24-hour format
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Location <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Rooftop Deck"
                value={formData.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  })
                }
                className="font-poppins"
              />
            </div>
          </div>

          {/* Capacity and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Max Capacity <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="1"
                placeholder="e.g. 120"
                value={formData.maxCapacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxCapacity: e.target.value,
                  })
                }
                className="font-poppins"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Ticket Price (LKR)
              </label>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 5000 (0 for free)"
                value={formData.ticketPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ticketPrice: e.target.value,
                  })
                }
                className="font-poppins"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Tags (comma separated)
            </label>
            <Input
              placeholder="e.g. live-music, dinner, exclusive"
              value={formData.tags}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value,
                })
              }
              className="font-poppins"
            />
          </div>

          {/* Event Image */}
          <div className="space-y-3">
            <label className="text-sm font-medium font-poppins">
              Event Image
              <span className="text-gray-400 font-normal ml-1">(1 photo)</span>
            </label>

            {/* Show current image: newly selected preview takes priority over existing */}
            {newImagePreview || existingImages[0]?.url ? (
              <div
                className="relative group rounded-lg overflow-hidden border border-gray-200"
                style={{ aspectRatio: "16/9" }}
              >
                <img
                  src={newImagePreview || existingImages[0]?.url}
                  alt="Event image"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <button
                  type="button"
                  onClick={() => {
                    if (newImagePreview) {
                      URL.revokeObjectURL(newImagePreview);
                      setNewImageFile(undefined);
                      setNewImagePreview(undefined);
                    } else {
                      setExistingImages([]);
                    }
                  }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/90 text-white rounded-md px-2 py-1 text-xs font-poppins opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-8 text-sm font-poppins text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <ImagePlus className="w-6 h-6" />
                <span>Click to upload event image</span>
                <span className="text-xs text-gray-400">
                  JPEG, PNG, WebP · Max 5 MB
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (newImagePreview) URL.revokeObjectURL(newImagePreview);
                setNewImageFile(file);
                setNewImagePreview(URL.createObjectURL(file));
                // Clear existing so new one replaces it
                setExistingImages([]);
                e.target.value = "";
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="font-poppins"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-black hover:bg-gray-900 font-poppins"
          >
            {isEditing ? "Update Event" : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
