"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, ImagePlus, X, Check } from "lucide-react";
import { updateMenuItem } from "@/lib/menu";
import { MenuItem } from "@/app/vendors/menu/page";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Starters",
  "Soups & Salads",
  "Mains",
  "Seafood",
  "Grills & BBQ",
  "Pasta & Rice",
  "Pizza",
  "Burgers & Sandwiches",
  "Sides",
  "Desserts",
  "Beverages",
  "Cocktails & Mocktails",
  "Wine & Spirits",
  "Kids Menu",
  "Vegan & Vegetarian",
  "Specials",
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  item: MenuItem;
};

export function EditMenuItemDialog({
  open,
  onOpenChange,
  onSuccess,
  item,
}: Props) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [price, setPrice] = useState(String(item.price));
  const [description, setDescription] = useState(item.description ?? "");
  const [currency, setCurrency] = useState(item.currency ?? "LKR");
  const [isAvailable, setIsAvailable] = useState(item.is_available);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    item.image ?? null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Reset to item values whenever the dialog opens with a new item
  useEffect(() => {
    if (open) {
      setName(item.name);
      setCategory(item.category);
      setPrice(String(item.price));
      setDescription(item.description ?? "");
      setCurrency(item.currency ?? "LKR");
      setIsAvailable(item.is_available);
      setImageFile(null);
      setImagePreview(item.image ?? null);
    }
  }, [open, item]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!name.trim() || !category || !price) {
      toast({
        title: "Missing fields",
        description: "Name, category and price are required.",
        variant: "destructive",
      });
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateMenuItem(item._id, {
        name: name.trim(),
        category,
        price: parsedPrice,
        description: description.trim() || undefined,
        currency,
        is_available: isAvailable,
        ...(imageFile ? { image: imageFile } : {}),
      });

      toast({
        title: "Success",
        description: "Menu item updated successfully.",
      });
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update menu item.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="font-bebas text-2xl tracking-tight">
            Edit Menu Item
          </DialogTitle>
          <DialogDescription className="font-poppins text-sm">
            Update the details for this menu item.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g. Grilled Salmon"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-poppins"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                placeholder="Type or select a category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCategoryOpen(true);
                }}
                onFocus={() => setCategoryOpen(true)}
                onBlur={() => {
                  // Delay to allow clicking on items
                  setTimeout(() => setCategoryOpen(false), 200);
                }}
                className="font-poppins"
              />
              {categoryOpen && category !== "" && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {CATEGORIES.filter((cat) =>
                    cat.toLowerCase().includes(category.toLowerCase()),
                  ).length > 0 ? (
                    <div className="py-1">
                      {CATEGORIES.filter((cat) =>
                        cat.toLowerCase().includes(category.toLowerCase()),
                      ).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setCategory(cat);
                            setCategoryOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm font-poppins hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Check
                            className={cn(
                              "h-4 w-4",
                              category === cat ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {cat}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-2 px-3 text-sm font-poppins text-gray-500">
                      Press Enter to use &quot;{category}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 font-poppins">
              Type to filter suggestions or enter a custom category
            </p>
          </div>

          {/* Price + Currency */}
          <div className="flex gap-3">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium font-poppins">
                Price <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="font-poppins"
              />
            </div>
            <div className="space-y-2 w-28">
              <label className="text-sm font-medium font-poppins">
                Currency
              </label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="font-poppins">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LKR">LKR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">
              Description
            </label>
            <Textarea
              placeholder="Brief description of the item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="font-poppins resize-none"
              rows={3}
            />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3">
            <input
              id="edit_is_available"
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 cursor-pointer"
            />
            <label
              htmlFor="edit_is_available"
              className="text-sm font-medium font-poppins cursor-pointer"
            >
              Available
            </label>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium font-poppins">Image</label>
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
              >
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm font-poppins">
                  Click to upload image
                </span>
                <span className="text-xs font-poppins">
                  JPG, PNG, WebP — max 5 MB
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="font-poppins"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="font-poppins bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
