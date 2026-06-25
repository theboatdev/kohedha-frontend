"use client";

import { useState, useEffect, useMemo } from "react";
import { VendorLayout } from "@/components/vendors/vendor-layout";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Loader2,
  Search,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItemsTable } from "@/components/vendors/menu-items-table";
import { MenuSearchFilter } from "@/components/vendors/menu-search-filter";
import { CSVUploadDialog } from "@/components/vendors/csv-upload-dialog";
import { PDFUploadDialog } from "@/components/vendors/pdf-upload-dialog";
import { CreateMenuItemDialog } from "@/components/vendors/create-menu-item-dialog";
import { getMenuItems } from "@/lib/menu";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export interface MenuItem {
  _id: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  is_available: boolean;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  upvotes?: number; // Mock data for now
  downvotes?: number; // Mock data for now
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const { toast } = useToast();
  const router = useRouter();

  // Generate mock upvote data for each item (deterministic based on item ID)
  const addMockUpvotes = (items: MenuItem[]): MenuItem[] => {
    return items.map((item) => {
      // Generate deterministic mock upvotes and downvotes based on item ID
      const hash = item._id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const upvotes = (hash % 50) + 1; // Between 1 and 50
      const downvotes = ((hash * 7) % 20) + 1; // Between 1 and 20 (generally fewer downvotes)
      return { ...item, upvotes, downvotes };
    });
  };

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const items = await getMenuItems();
      const itemsWithUpvotes = addMockUpvotes(items);
      setMenuItems(itemsWithUpvotes);
      setFilteredItems(itemsWithUpvotes);
    } catch (error: any) {
      console.error("Failed to fetch menu items:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Filter, search, and sort logic
  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query),
      );
    }

    // Sort items
    let sorted;
    if (sortBy === "default") {
      sorted = [...filtered]; // Create new array to trigger re-render
    } else {
      sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "upvotes-most":
            return (b.upvotes || 0) - (a.upvotes || 0);
          case "upvotes-least":
            return (a.upvotes || 0) - (b.upvotes || 0);
          default:
            return 0;
        }
      });
    }

    setFilteredItems(sorted);
  }, [searchQuery, selectedCategory, sortBy, menuItems]);

  // Get unique categories
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category)),
  ).sort();

  const handleUploadSuccess = () => {
    setCsvDialogOpen(false);
    setPdfDialogOpen(false);
    fetchMenuItems();
    toast({
      title: "Success",
      description: "Menu items uploaded successfully",
    });
  };

  return (
    <VendorLayout pageTitle="Menu Management">
      <div style={{ minHeight: "100vh", background: "#F0F0EE" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Upload Buttons */}
          <div
            className="rounded-xl p-6 shadow-lg mb-8"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(13,13,13,0.09)",
            }}
          >
            <h2
              className="text-xl font-poppins font-bold mb-4"
              style={{ color: "#0D0D0D" }}
            >
              Upload Menu
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setAddItemDialogOpen(true)}
                className="font-poppins"
                style={{ background: "#F5E642", color: "#0D0D0D" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#E8D800")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#F5E642")
                }
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Item
              </Button>
              <Button
                onClick={() => setCsvDialogOpen(true)}
                className="font-poppins"
                style={{ background: "#0D0D0D", color: "#FFFFFF" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#0D0D0D")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#111111")
                }
                size="lg"
              >
                <FileSpreadsheet className="mr-2 h-5 w-5" />
                Upload CSV
              </Button>
              <Button
                onClick={() => setPdfDialogOpen(true)}
                className="font-poppins"
                style={{ background: "rgba(13,13,13,0.08)", color: "rgba(13,13,13,0.48)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#5A5348")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(13,13,13,0.08)")
                }
                size="lg"
              >
                <FileText className="mr-2 h-5 w-5" />
                Upload PDF
              </Button>
            </div>
            <p
              className="text-sm font-poppins mt-4"
              style={{ color: "rgba(13,13,13,0.48)" }}
            >
              Upload your menu using CSV for structured data or PDF for
              AI-powered extraction
            </p>
          </div>

          {/* Menu Items Table */}
          <div
            className="rounded-xl p-6 shadow-lg"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(13,13,13,0.09)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-poppins font-bold" style={{ color: "#0D0D0D" }}>
                Menu Items ({filteredItems.length})
              </h2>
              <Button
                onClick={fetchMenuItems}
                variant="outline"
                size="sm"
                style={{ borderColor: "rgba(13,13,13,0.18)", color: "#0D0D0D" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>

            {/* Search, Filter and Sort Section */}
            {menuItems.length > 0 && (
              <MenuSearchFilter
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                categories={categories}
                sortBy={sortBy}
                onSearchChange={setSearchQuery}
                onCategoryChange={setSelectedCategory}
                onSortChange={setSortBy}
              />
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2
                  className="h-8 w-8 animate-spin"
                  style={{ color: "#0D0D0D" }}
                />
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-12">
                <Upload
                  className="h-16 w-16 mx-auto mb-4"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                />
                <h3
                  className="text-lg font-poppins font-medium mb-2"
                  style={{ color: "#0D0D0D" }}
                >
                  No menu items yet
                </h3>
                <p className="font-poppins mb-6" style={{ color: "rgba(13,13,13,0.48)" }}>
                  Upload your first menu using CSV or PDF
                </p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Search
                  className="h-16 w-16 mx-auto mb-4"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                />
                <h3
                  className="text-lg font-poppins font-medium mb-2"
                  style={{ color: "#0D0D0D" }}
                >
                  No items found
                </h3>
                <p className="font-poppins mb-6" style={{ color: "rgba(13,13,13,0.48)" }}>
                  Try adjusting your search or filter
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  variant="outline"
                  className="font-poppins"
                  style={{
                    borderColor: "rgba(13,13,13,0.18)",
                    color: "#0D0D0D",
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <MenuItemsTable
                menuItems={filteredItems}
                onRefresh={fetchMenuItems}
              />
            )}
          </div>
        </div>
      </div>

      {/* Upload Dialogs */}
      <CSVUploadDialog
        open={csvDialogOpen}
        onOpenChange={setCsvDialogOpen}
        onSuccess={handleUploadSuccess}
      />
      <PDFUploadDialog
        open={pdfDialogOpen}
        onOpenChange={setPdfDialogOpen}
        onSuccess={handleUploadSuccess}
      />
      <CreateMenuItemDialog
        open={addItemDialogOpen}
        onOpenChange={setAddItemDialogOpen}
        onSuccess={() => {
          setAddItemDialogOpen(false);
          fetchMenuItems();
        }}
      />
    </VendorLayout>
  );
}
