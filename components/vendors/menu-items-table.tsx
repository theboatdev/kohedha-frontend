"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Trash2,
  Eye,
  EyeOff,
  UtensilsCrossed,
  Pencil,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { deleteMenuItem, updateMenuItem } from "@/lib/menu";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@/app/vendors/menu/page";
import Image from "next/image";
import { EditMenuItemDialog } from "@/components/vendors/edit-menu-item-dialog";

interface MenuItemsTableProps {
  menuItems: MenuItem[];
  onRefresh: () => void;
}

export function MenuItemsTable({ menuItems, onRefresh }: MenuItemsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      setIsDeleting(true);
      await deleteMenuItem(selectedItem._id);
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete menu item",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await updateMenuItem(item._id, {
        is_available: !item.is_available,
      });
      toast({
        title: "Success",
        description: `Menu item ${item.is_available ? "disabled" : "enabled"}`,
      });
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update menu item",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  // Group items by category while preserving order
  const groupedItems: { category: string; items: MenuItem[] }[] = [];
  const categoryMap = new Map<string, MenuItem[]>();

  // Group items while maintaining their order
  menuItems.forEach((item) => {
    if (!categoryMap.has(item.category)) {
      categoryMap.set(item.category, []);
      groupedItems.push({
        category: item.category,
        items: categoryMap.get(item.category)!,
      });
    }
    categoryMap.get(item.category)!.push(item);
  });

  return (
    <>
      <div className="space-y-8">
        {groupedItems.map(({ category, items }) => (
          <div key={category}>
            <h3
              className="font-poppins font-bold text-2xl mb-4 flex items-center gap-2"
              style={{ color: "#0D0D0D" }}
            >
              {category}
              <Badge
                variant="secondary"
                className="font-poppins"
                style={{ background: "#E8E8E4", color: "#0D0D0D" }}
              >
                {items.length}
              </Badge>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  style={{
                    background: "white",
                    border: "1px solid rgba(13,13,13,0.08)",
                  }}
                >
                  {/* Image Section - Square aspect ratio */}
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ paddingBottom: "100%" }}
                  >
                    {/* Food Image - Using Unsplash placeholder */}
                    <Image
                      src={item.image || `/placeholder.jpg`}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `/placeholder.jpg`;
                      }}
                    />

                    {/* Availability Badge Overlay */}
                    <div className="absolute top-3 left-3 z-10">
                      <Badge
                        className={`font-poppins shadow-md border-0 ${item.is_available ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                      >
                        {item.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>

                    {/* Actions Dropdown - Top Right */}
                    <div className="absolute top-3 right-3 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full shadow-md bg-white/90 hover:bg-white"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel className="font-poppins">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openEditDialog(item)}
                            className="font-poppins cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleAvailability(item)}
                            className="font-poppins cursor-pointer"
                          >
                            {item.is_available ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Mark Unavailable
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Mark Available
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(item)}
                            className="font-poppins text-red-600 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Hover Overlay Effect */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
                  </div>

                  {/* Details Section */}
                  <div className="p-4 space-y-2">
                    {/* Item Name */}
                    <h4
                      className="font-poppins font-bold text-xl leading-tight"
                      style={{ color: "#0D0D0D" }}
                    >
                      {item.name}
                    </h4>

                    {/* Description */}
                    <p
                      className="font-poppins text-sm line-clamp-2 min-h-[2.5rem]"
                      style={{ color: "rgba(13,13,13,0.48)" }}
                    >
                      {item.description || "No description available"}
                    </p>

                    {/* Price and Upvotes/Downvotes */}
                    <div
                      className="pt-2 flex items-center justify-between gap-2"
                      style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}
                    >
                      <p
                        className="font-poppins text-lg font-bold"
                        style={{ color: "#0D0D0D" }}
                      >
                        {item.currency} {item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        {item.upvotes !== undefined && (
                          <div
                            className="flex items-center gap-1 px-2 py-1 rounded-full"
                            style={{ background: "#FFF7ED" }}
                          >
                            <ThumbsUp
                              className="h-3.5 w-3.5"
                              style={{ color: "#F5E642" }}
                            />
                            <span
                              className="font-poppins text-xs font-semibold"
                              style={{ color: "#F5E642" }}
                            >
                              {item.upvotes}
                            </span>
                          </div>
                        )}
                        {item.downvotes !== undefined && (
                          <div
                            className="flex items-center gap-1 px-2 py-1 rounded-full"
                            style={{ background: "#FEE2E2" }}
                          >
                            <ThumbsDown
                              className="h-3.5 w-3.5"
                              style={{ color: "#DC2626" }}
                            />
                            <span
                              className="font-poppins text-xs font-semibold"
                              style={{ color: "#DC2626" }}
                            >
                              {item.downvotes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {selectedItem && editDialogOpen && (
        <EditMenuItemDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={onRefresh}
          item={selectedItem}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-poppins font-bold text-xl">
              Delete Menu Item
            </AlertDialogTitle>
            <AlertDialogDescription className="font-poppins">
              Are you sure you want to delete "{selectedItem?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-poppins">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 font-poppins"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
