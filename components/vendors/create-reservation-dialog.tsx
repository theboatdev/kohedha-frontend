import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type NewReservationData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: string;
  tableNumber: string;
  specialRequests: string;
};

type CreateReservationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateReservation: (data: NewReservationData) => void;
};

export function CreateReservationDialog({
  open,
  onOpenChange,
  onCreateReservation,
}: CreateReservationDialogProps) {
  const [formData, setFormData] = useState<NewReservationData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    date: "",
    time: "",
    guests: "",
    tableNumber: "",
    specialRequests: "",
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (
      !formData.customerName ||
      !formData.customerPhone ||
      !formData.date ||
      !formData.time ||
      !formData.guests
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    onCreateReservation(formData);
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      date: "",
      time: "",
      guests: "",
      tableNumber: "",
      specialRequests: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-12 bg-black hover:bg-gray-900 text-white font-poppins font-medium">
          <Plus className="w-4 h-4 mr-2" />
          New Reservation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-2xl">
            Create New Reservation
          </DialogTitle>
          <DialogDescription className="font-poppins text-sm">
            Add a new reservation for a customer
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. John Doe"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerName: e.target.value,
                  })
                }
                className="font-poppins"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="+94712345678"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerPhone: e.target.value,
                  })
                }
                className="font-poppins"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="customer@example.com"
              value={formData.customerEmail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customerEmail: e.target.value,
                })
              }
              className="font-poppins"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date: e.target.value,
                  })
                }
                className="font-poppins"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Time <span className="text-red-500">*</span>
              </label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    time: e.target.value,
                  })
                }
                className="font-poppins"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Number of Guests <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="1"
                placeholder="e.g. 4"
                value={formData.guests}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guests: e.target.value,
                  })
                }
                className="font-poppins"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Table Number
              </label>
              <Input
                placeholder="e.g. T-12"
                value={formData.tableNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tableNumber: e.target.value,
                  })
                }
                className="font-poppins"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Special Requests
            </label>
            <Textarea
              placeholder="Any special requirements or requests..."
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specialRequests: e.target.value,
                })
              }
              className="font-poppins min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-poppins"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-black hover:bg-gray-900 font-poppins"
          >
            Create Reservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
