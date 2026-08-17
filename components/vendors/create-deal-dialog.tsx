import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { ImagePlus, Loader2, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export type DealType = "ambient" | "voucher" | "limited-quantity" | "loyalty";

export type ActiveWindow = {
  daysOfWeek: number[]; // 0=Sun … 6=Sat
  startTime?: string;   // "HH:mm"
  endTime?: string;     // "HH:mm"
};

export type VoucherConfig = {
  claimExpiryMinutes?: number;
  rewardLabel?: string;
};

export type LimitedQuantityConfig = {
  totalQuantity?: number;
  remainingQuantity?: number;
  claimExpiryMinutes?: number;
  rewardLabel?: string;
};

export type LoyaltyConfig = {
  stampsRequired?: number;
  claimExpiryMinutes?: number;
  rewardLabel?: string;
};

export type NewDealData = {
  dealName: string;
  description: string;
  category:
    | "food-beverage"
    | "entertainment"
    | "accommodation"
    | "wellness-spa"
    | "shopping"
    | "travel-adventure"
    | "dining-experience"
    | "events"
    | "other";
  notes?: string;
  imageFile?: File;
  existingImageUrl?: string;
  status?: "active" | "expired" | "coming-soon" | "paused" | "sold-out";
  priority?: string;
  tags?: string;
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
  dealType?: DealType;
  activeWindow?: ActiveWindow;
  voucherConfig?: VoucherConfig;
  limitedQuantityConfig?: LimitedQuantityConfig;
  loyaltyConfig?: LoyaltyConfig;
};

type CreateDealDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateDeal: (data: NewDealData) => void | Promise<void>;
  initialData?: NewDealData;
  mode?: "create" | "edit";
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const initialFormData: NewDealData = {
  dealName: "",
  description: "",
  category: "food-beverage",
  notes: "",
  imageFile: undefined,
  existingImageUrl: undefined,
  status: "active",
  priority: "5",
  tags: "",
  isPublished: false,
  startDate: undefined,
  endDate: undefined,
  dealType: "ambient",
  activeWindow: { daysOfWeek: [], startTime: "", endTime: "" },
  voucherConfig: { claimExpiryMinutes: 120, rewardLabel: "" },
  limitedQuantityConfig: { totalQuantity: 50, claimExpiryMinutes: 30, rewardLabel: "" },
  loyaltyConfig: { stampsRequired: 9, claimExpiryMinutes: 10080, rewardLabel: "" },
};

export function CreateDealDialog({
  open,
  onOpenChange,
  onCreateDeal,
  initialData,
  mode = "create",
}: CreateDealDialogProps) {
  const [formData, setFormData] = useState<NewDealData>(initialFormData);
  const [newImageFile, setNewImageFile] = useState<File | undefined>(undefined);
  const [newImagePreview, setNewImagePreview] = useState<string | undefined>(
    undefined,
  );
  const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>(
    undefined,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Hydrate only when the dialog opens — do not depend on initialData identity
  // (parent rebuilds that object every render and would wipe in-progress edits).
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData);
        setExistingImageUrl(initialData.existingImageUrl);
      } else {
        setFormData(initialFormData);
        setExistingImageUrl(undefined);
      }
      if (newImagePreview) URL.revokeObjectURL(newImagePreview);
      setNewImageFile(undefined);
      setNewImagePreview(undefined);
    } else {
      resetImageState();
      setFormData(initialFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-hydrate on open
  }, [open]);

  function resetImageState() {
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImageFile(undefined);
    setNewImagePreview(undefined);
    setExistingImageUrl(undefined);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
    // Clear existing image — new upload replaces it
    setExistingImageUrl(undefined);
  };

  const handleRemoveNewImage = () => {
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImageFile(undefined);
    setNewImagePreview(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveExistingImage = () => {
    setExistingImageUrl(undefined);
  };

  const handleSubmit = async () => {
    if (!formData.dealName || !formData.description || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Validation Error",
        description: "Please select both a start date and an end date.",
        variant: "destructive",
      });
      return;
    }

    if (formData.dealType === "limited-quantity") {
      const totalQuantity = Number(
        formData.limitedQuantityConfig?.totalQuantity,
      );
      if (!totalQuantity || totalQuantity < 1) {
        toast({
          title: "Validation Error",
          description: "Please provide a total quantity of at least 1.",
          variant: "destructive",
        });
        return;
      }

      const holdMinutes = Number(
        formData.limitedQuantityConfig?.claimExpiryMinutes,
      );
      if (!holdMinutes || holdMinutes < 5) {
        toast({
          title: "Validation Error",
          description: "Hold timeout must be at least 5 minutes.",
          variant: "destructive",
        });
        return;
      }
      if (holdMinutes > 10080) {
        toast({
          title: "Validation Error",
          description: "Hold timeout cannot exceed 7 days (10080 minutes).",
          variant: "destructive",
        });
        return;
      }
    }

    if (formData.dealType === "voucher") {
      const expiryMinutes = Number(formData.voucherConfig?.claimExpiryMinutes);
      if (!expiryMinutes || expiryMinutes < 5) {
        toast({
          title: "Validation Error",
          description: "Claim expiry must be at least 5 minutes.",
          variant: "destructive",
        });
        return;
      }
      if (expiryMinutes > 10080) {
        toast({
          title: "Validation Error",
          description: "Claim expiry cannot exceed 7 days (10080 minutes).",
          variant: "destructive",
        });
        return;
      }
    }

    if (formData.dealType === "loyalty") {
      const stampsRequired = Number(formData.loyaltyConfig?.stampsRequired);
      if (!stampsRequired || stampsRequired < 2 || stampsRequired > 100) {
        toast({
          title: "Validation Error",
          description: "Stamps required must be between 2 and 100.",
          variant: "destructive",
        });
        return;
      }

      const rewardExpiryMinutes = Number(
        formData.loyaltyConfig?.claimExpiryMinutes,
      );
      if (!rewardExpiryMinutes || rewardExpiryMinutes < 5) {
        toast({
          title: "Validation Error",
          description: "Reward expiry must be at least 5 minutes.",
          variant: "destructive",
        });
        return;
      }
      if (rewardExpiryMinutes > 10080) {
        toast({
          title: "Validation Error",
          description: "Reward expiry cannot exceed 7 days (10080 minutes).",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload: NewDealData = {
        ...formData,
        imageFile: newImageFile,
        existingImageUrl: existingImageUrl,
      };
      await onCreateDeal(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSubmitting) return;
    onOpenChange(nextOpen);
    if (!nextOpen) {
      resetImageState();
      setFormData(initialFormData);
    }
  };

  // Determine what image is currently shown
  const displayedImage = newImagePreview || existingImageUrl;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-2xl tracking-tight">
            {mode === "edit" ? "Edit Deal" : "Create New Deal"}
          </DialogTitle>
          <DialogDescription className="font-poppins text-sm">
            {mode === "edit"
              ? "Update your deal information below."
              : "Fill in the details to create a new deal."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Deal Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g. Weekend Special Package"
              value={formData.dealName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dealName: e.target.value,
                })
              }
              className="font-poppins"
            />
          </div>

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
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
                <SelectItem value="wellness-spa">Wellness & Spa</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="travel-adventure">
                  Travel & Adventure
                </SelectItem>
                <SelectItem value="dining-experience">
                  Dining Experience
                </SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deal Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">Deal Type</label>
            <Select
              value={formData.dealType ?? "ambient"}
              onValueChange={(value: DealType) =>
                setFormData({ ...formData, dealType: value })
              }
            >
              <SelectTrigger className="font-poppins">
                <SelectValue placeholder="Select deal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ambient">Ambient (time-window)</SelectItem>
                <SelectItem value="voucher">
                  Voucher (single-use code)
                </SelectItem>
                <SelectItem value="limited-quantity">
                  Limited Quantity (flash deal)
                </SelectItem>
                <SelectItem value="loyalty">
                  Loyalty / Stamps (buy N, get one free)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ambient active window — only shown when dealType === "ambient" */}
          {(formData.dealType === "ambient" || !formData.dealType) && (
            <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="font-poppins text-sm font-medium text-gray-700">
                Active Window{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </p>
              <p className="font-poppins text-xs text-gray-500 -mt-1">
                Defines when this deal is "valid now". Leave blank to show as
                always active.
              </p>

              {/* Days of week */}
              <div className="space-y-1.5">
                <label className="font-poppins text-xs font-medium text-gray-600">
                  Days of week
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAY_LABELS.map((label, idx) => {
                    const selected = (
                      formData.activeWindow?.daysOfWeek ?? []
                    ).includes(idx);
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          const current =
                            formData.activeWindow?.daysOfWeek ?? [];
                          const next = selected
                            ? current.filter((d) => d !== idx)
                            : [...current, idx].sort((a, b) => a - b);
                          setFormData({
                            ...formData,
                            activeWindow: {
                              ...formData.activeWindow,
                              daysOfWeek: next,
                            },
                          });
                        }}
                        className={`font-poppins text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          selected
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start / end time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-poppins text-xs font-medium text-gray-600">
                    Start time
                  </label>
                  <input
                    type="time"
                    value={formData.activeWindow?.startTime ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        activeWindow: {
                          ...formData.activeWindow,
                          daysOfWeek:
                            formData.activeWindow?.daysOfWeek ?? [],
                          startTime: e.target.value,
                        },
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-poppins text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-poppins text-xs font-medium text-gray-600">
                    End time
                  </label>
                  <input
                    type="time"
                    value={formData.activeWindow?.endTime ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        activeWindow: {
                          ...formData.activeWindow,
                          daysOfWeek:
                            formData.activeWindow?.daysOfWeek ?? [],
                          endTime: e.target.value,
                        },
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-poppins text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Voucher config — only shown when dealType === "voucher" */}
          {formData.dealType === "voucher" && (
            <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="font-poppins text-sm font-medium text-gray-700">
                Voucher Settings
              </p>
              <p className="font-poppins text-xs text-gray-500 -mt-1">
                Each customer who claims this deal gets a unique code (e.g.
                "K7M2-9X4Q"). Staff enter or scan that code on the{" "}
                <span className="font-medium">Redeem Voucher</span> page to
                mark it used — a code can only ever be redeemed once.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-poppins text-xs font-medium text-gray-600">
                    Reward label
                  </label>
                  <Input
                    placeholder="e.g. BOGO, Free Appetizer, 20% off"
                    value={formData.voucherConfig?.rewardLabel ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        voucherConfig: {
                          ...formData.voucherConfig,
                          rewardLabel: e.target.value,
                        },
                      })
                    }
                    className="font-poppins"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-poppins text-xs font-medium text-gray-600">
                    Claim expiry (minutes)
                  </label>
                  <Input
                    type="number"
                    min={5}
                    max={10080}
                    placeholder="120"
                    value={formData.voucherConfig?.claimExpiryMinutes ?? 120}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        voucherConfig: {
                          ...formData.voucherConfig,
                          claimExpiryMinutes: Number(e.target.value) || 120,
                        },
                      })
                    }
                    className="font-poppins"
                  />
                  <p className="font-poppins text-[11px] text-gray-400">
                    How long a claimed code stays valid before it auto-expires
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Limited quantity config — only shown when dealType === "limited-quantity" */}
          {formData.dealType === "limited-quantity" && (
            <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="font-poppins text-sm font-medium text-gray-700">
                Limited Quantity Settings
              </p>
              <p className="font-poppins text-xs text-gray-500 -mt-1">
                Only a fixed number of slots are available (e.g. "first 50
                customers"). Each claim reserves one slot and generates a
                unique code; if it isn't redeemed before the hold expires,
                the slot is released back into stock automatically.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-poppins text-xs font-medium text-gray-600">
                    Total quantity <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="50"
                    value={formData.limitedQuantityConfig?.totalQuantity ?? 50}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        limitedQuantityConfig: {
                          ...formData.limitedQuantityConfig,
                          totalQuantity: Number(e.target.value) || undefined,
                        },
                      })
                    }
                    className="font-poppins"
                  />
                  {formData.limitedQuantityConfig?.remainingQuantity !=
                    null && (
                    <p className="font-poppins text-[11px] text-gray-400">
                      {formData.limitedQuantityConfig.remainingQuantity}{" "}
                      remaining right now
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="font-poppins text-xs font-medium text-gray-600">
                    Hold timeout (minutes)
                  </label>
                  <Input
                    type="number"
                    min={5}
                    max={10080}
                    placeholder="30"
                    value={formData.limitedQuantityConfig?.claimExpiryMinutes ?? 30}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        limitedQuantityConfig: {
                          ...formData.limitedQuantityConfig,
                          claimExpiryMinutes: Number(e.target.value) || 30,
                        },
                      })
                    }
                    className="font-poppins"
                  />
                  <p className="font-poppins text-[11px] text-gray-400">
                    How long a reserved slot is held before it's released
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-poppins text-xs font-medium text-gray-600">
                  Reward label
                </label>
                <Input
                  placeholder="e.g. First 50 customers, Daily drop"
                  value={formData.limitedQuantityConfig?.rewardLabel ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      limitedQuantityConfig: {
                        ...formData.limitedQuantityConfig,
                        rewardLabel: e.target.value,
                      },
                    })
                  }
                  className="font-poppins"
                />
              </div>
            </div>
          )}

          {/* Loyalty config — only shown when dealType === "loyalty" */}
          {formData.dealType === "loyalty" && (
            <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="font-poppins text-sm font-medium text-gray-700">
                Loyalty / Stamp Settings
              </p>
              <p className="font-poppins text-xs text-gray-500 -mt-1">
                Customers enroll once to get a persistent loyalty card code.
                Each qualifying visit adds a stamp; hitting the stamp
                threshold automatically mints a single-use reward code that
                staff redeem exactly like a voucher.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-poppins text-xs font-medium text-gray-600">
                    Stamps required <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min={2}
                    max={100}
                    placeholder="9"
                    value={formData.loyaltyConfig?.stampsRequired ?? 9}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loyaltyConfig: {
                          ...formData.loyaltyConfig,
                          stampsRequired: Number(e.target.value) || undefined,
                        },
                      })
                    }
                    className="font-poppins"
                  />
                  <p className="font-poppins text-[11px] text-gray-400">
                    e.g. 9 for "buy 9, get the 10th free"
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="font-poppins text-xs font-medium text-gray-600">
                    Reward expiry (minutes)
                  </label>
                  <Input
                    type="number"
                    min={5}
                    max={10080}
                    placeholder="10080"
                    value={formData.loyaltyConfig?.claimExpiryMinutes ?? 10080}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loyaltyConfig: {
                          ...formData.loyaltyConfig,
                          claimExpiryMinutes: Number(e.target.value) || 10080,
                        },
                      })
                    }
                    className="font-poppins"
                  />
                  <p className="font-poppins text-[11px] text-gray-400">
                    How long a minted reward code stays valid before it
                    auto-expires
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-poppins text-xs font-medium text-gray-600">
                  Reward label
                </label>
                <Input
                  placeholder="e.g. Buy 9, get the 10th free"
                  value={formData.loyaltyConfig?.rewardLabel ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      loyaltyConfig: {
                        ...formData.loyaltyConfig,
                        rewardLabel: e.target.value,
                      },
                    })
                  }
                  className="font-poppins"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Describe your deal in detail..."
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

          {/* Image upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Deal Image{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            {displayedImage ? (
              <div
                className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                style={{ height: "180px" }}
              >
                <img
                  src={displayedImage}
                  alt="Deal preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={
                    newImagePreview
                      ? handleRemoveNewImage
                      : handleRemoveExistingImage
                  }
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {newImageFile && (
                  <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full font-poppins">
                    New image selected
                  </span>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors bg-gray-50"
              >
                <ImagePlus className="w-8 h-8" />
                <span className="font-poppins text-sm">
                  Click to upload an image
                </span>
                <span className="font-poppins text-xs">
                  JPG, PNG, WebP · max 5 MB
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            {displayedImage && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="font-poppins text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Replace image
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData({
                    ...formData,
                    status: value,
                  })
                }
              >
                <SelectTrigger className="font-poppins">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="coming-soon">Coming Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="sold-out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Priority (1-10)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                placeholder="5"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value,
                  })
                }
                className="font-poppins"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Tags (comma-separated)
            </label>
            <Input
              placeholder="e.g. weekend, special, discount"
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

          {/* Date range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                Start Date <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex h-10 w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-poppins text-gray-900 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                  >
                    <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {formData.startDate ? (
                      <span>
                        {format(new Date(formData.startDate), "MMM d, yyyy")}
                      </span>
                    ) : (
                      <span className="text-gray-400">Pick start date</span>
                    )}
                    {formData.startDate && (
                      <X
                        className="w-3.5 h-3.5 ml-auto text-gray-400 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, startDate: undefined });
                        }}
                      />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.startDate
                        ? new Date(formData.startDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setFormData({
                        ...formData,
                        startDate: date ? date.toISOString() : undefined,
                        endDate:
                          formData.endDate && date
                            ? new Date(formData.endDate) < date
                              ? undefined
                              : formData.endDate
                            : formData.endDate,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium font-poppins">
                End Date <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex h-10 w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-poppins text-gray-900 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                  >
                    <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {formData.endDate ? (
                      <span>
                        {format(new Date(formData.endDate), "MMM d, yyyy")}
                      </span>
                    ) : (
                      <span className="text-gray-400">Pick end date</span>
                    )}
                    {formData.endDate && (
                      <X
                        className="w-3.5 h-3.5 ml-auto text-gray-400 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, endDate: undefined });
                        }}
                      />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.endDate
                        ? new Date(formData.endDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setFormData({
                        ...formData,
                        endDate: date ? date.toISOString() : undefined,
                      })
                    }
                    disabled={(date) =>
                      formData.startDate
                        ? date < new Date(formData.startDate)
                        : false
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Additional Notes
            </label>
            <Textarea
              placeholder="Any additional information or terms..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notes: e.target.value,
                })
              }
              className="font-poppins min-h-[80px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  isPublished: checked as boolean,
                })
              }
            />
            <label
              htmlFor="isPublished"
              className="text-sm font-medium font-poppins cursor-pointer"
            >
              Publish this deal
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="font-poppins"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-black hover:bg-gray-900 font-poppins min-w-[140px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "edit" ? "Updating…" : "Creating…"}
              </>
            ) : mode === "edit" ? (
              "Update Deal"
            ) : (
              "Create Deal"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
