"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VendorLayout } from "@/components/vendors/vendor-layout";
import {
  CreateDealDialog,
  type NewDealData,
} from "@/components/vendors/create-deal-dialog";
import { DeleteConfirmationDialog } from "@/components/vendors/delete-confirmation-dialog";
import {
  DealCard,
  type DealItem,
  type DealStatus,
} from "@/components/vendors/deal-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag, Search, Filter, Plus } from "lucide-react";
import { signOutVendor } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  createDeal,
  getVendorDeals,
  getDealById,
  deleteDeal,
  updateDeal,
  type Deal,
} from "@/lib/deals";

const initialDeals: DealItem[] = [];

// Helper function to transform backend Deal to frontend DealItem
function transformDeal(backendDeal: Deal): DealItem {
  return {
    id: backendDeal._id,
    title: backendDeal.dealName,
    category: backendDeal.category,
    description: backendDeal.description,
    status: backendDeal.status,
    priority: backendDeal.priority,
    mainImage: backendDeal.mainImage?.url,
    tags: (() => {
      const t = backendDeal.tags;
      if (!t) return [];
      if (Array.isArray(t)) return t;
      try {
        const parsed = JSON.parse(t as any);
        return Array.isArray(parsed) ? parsed : [String(t)];
      } catch {
        return [String(t)];
      }
    })(),
    isPublished: backendDeal.isPublished,
    createdAt: backendDeal.createdAt,
    startDate: backendDeal.startDate,
    endDate: backendDeal.endDate,
    dealType: backendDeal.dealType,
  };
}

// Helper function to transform frontend NewDealData to backend CreateDealData
function transformToBackendDeal(frontendDeal: NewDealData) {
  return {
    dealName: frontendDeal.dealName,
    description: frontendDeal.description,
    category: frontendDeal.category,
    notes: frontendDeal.notes || "",
    imageFile: frontendDeal.imageFile,
    status: frontendDeal.status || "active",
    priority: Number(frontendDeal.priority || 5),
    tags: frontendDeal.tags
      ? frontendDeal.tags.split(",").map((tag) => tag.trim())
      : [],
    isPublished: frontendDeal.isPublished || false,
    startDate: frontendDeal.startDate,
    endDate: frontendDeal.endDate,
    dealType: frontendDeal.dealType || "regular",
  };
}

export default function DealsManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDeal, setEditingDeal] = useState<DealItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<string | null>(null);

  // Load deals on mount
  useEffect(() => {
    const loadDeals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getVendorDeals();
        const transformedDeals = result.data.map(transformDeal);
        setDeals(transformedDeals);
      } catch (err) {
        console.error("Failed to load deals:", err);
        setError("Failed to load deals. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load deals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDeals();
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

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || deal.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [deals, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const active = deals.filter((deal) => deal.status === "active").length;
    const published = deals.filter((deal) => deal.isPublished).length;

    return {
      total: deals.length,
      active,
      published,
    };
  }, [deals]);

  const handleCreateDeal = async (data: NewDealData) => {
    try {
      const backendData = transformToBackendDeal(data);
      const result = await createDeal(backendData);

      if (result.success && result.data) {
        const transformedDeal = transformDeal(result.data);
        setDeals((previous) => [transformedDeal, ...previous]);
        setIsDialogOpen(false);
        toast({
          title: "Deal Created",
          description: "Your deal has been created successfully.",
        });
      }
    } catch (err) {
      console.error("Failed to create deal:", err);
      toast({
        title: "Error",
        description: "Failed to create deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, status: DealStatus) => {
    try {
      const result = await updateDeal(id, { status });

      if (result.success) {
        setDeals((previous) =>
          previous.map((deal) => (deal.id === id ? { ...deal, status } : deal)),
        );
        toast({
          title: "Status Updated",
          description: `Deal status changed to ${status}.`,
        });
      }
    } catch (err) {
      console.error("Failed to update deal status:", err);
      toast({
        title: "Error",
        description: "Failed to update deal status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    setDealToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDeal = async () => {
    if (!dealToDelete) return;

    try {
      const result = await deleteDeal(dealToDelete);

      if (result.success) {
        setDeals((previous) =>
          previous.filter((deal) => deal.id !== dealToDelete),
        );
        setDealToDelete(null);
        toast({
          title: "Deal Deleted",
          description: "The deal has been removed.",
        });
      }
    } catch (err) {
      console.error("Failed to delete deal:", err);
      toast({
        title: "Error",
        description: "Failed to delete deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (id: string) => {
    try {
      // Fetch full deal data from backend to get all fields
      const result = await getDealById(id);
      if (result.success && result.data) {
        const deal = deals.find((d) => d.id === id);
        if (deal) {
          setEditingDeal({ ...deal, backendData: result.data });
          // Pre-populate form with existing values including current image URL
          setIsDialogOpen(true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch deal details:", err);
      toast({
        title: "Error",
        description: "Failed to load deal details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDeal = async (data: NewDealData) => {
    if (!editingDeal) return;

    try {
      const backendData = transformToBackendDeal(data);
      const result = await updateDeal(editingDeal.id, backendData);

      if (result.success && result.data) {
        const transformedDeal = transformDeal(result.data);
        setDeals((previous) =>
          previous.map((deal) =>
            deal.id === editingDeal.id ? transformedDeal : deal,
          ),
        );
        setIsDialogOpen(false);
        setEditingDeal(null);
        toast({
          title: "Deal Updated",
          description: "Your deal has been updated successfully.",
        });
      }
    } catch (err) {
      console.error("Failed to update deal:", err);
      toast({
        title: "Error",
        description: "Failed to update deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <VendorLayout onSignOut={handleSignOut} pageTitle="Manage Deals">
      <div style={{ minHeight: "100vh", background: "#F0F0EE" }}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
            <div className="flex items-center gap-4 flex-1">
              <div
                className="flex items-center gap-3 px-6 py-3 rounded-full h-12 whitespace-nowrap"
                style={{ background: "#0D0D0D", border: "1px solid #0D0D0D" }}
              >
                <Tag className="w-5 h-5" style={{ color: "rgba(255,255,255,0.9)" }} />
                <span
                  className="text-sm font-medium"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                >
                  {stats.total}{" "}
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>Total Deals</span>
                </span>
              </div>
            </div>

            <Button
              onClick={() => setIsDialogOpen(true)}
              className="h-12 font-poppins font-medium md:w-auto w-full"
              style={{
                background: "#F5E642",
                color: "#0D0D0D",
                borderRadius: "40px",
                padding: "13px 28px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#E8D800")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#F5E642")
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Deal
            </Button>
          </div>

          <div
            className="rounded-xl shadow-lg overflow-hidden"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(13,13,13,0.09)",
            }}
          >
            <div
              className="p-8"
              style={{ borderBottom: "1px solid rgba(13,13,13,0.09)" }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    style={{ color: "rgba(13,13,13,0.48)" }}
                  />
                  <Input
                    placeholder="Search by deal title or ID..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="coming-soon">Coming Soon</SelectItem>
                    <SelectItem value="sold-out">Sold Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <div
                    className="inline-block animate-spin rounded-full border-b-2 w-8 h-8 mb-4"
                    style={{ borderColor: "#F5E642" }}
                  ></div>
                  <p className="font-poppins" style={{ color: "rgba(13,13,13,0.48)" }}>
                    Loading deals...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <Tag
                    className="h-12 w-12 mx-auto mb-4"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  />
                  <p className="font-poppins mb-4" style={{ color: "#0D0D0D" }}>
                    {error}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="font-poppins"
                    style={{
                      background: "#F5E642",
                      color: "#0D0D0D",
                      borderRadius: "40px",
                      padding: "13px 28px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#E8D800")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#F5E642")
                    }
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredDeals.length === 0 ? (
                <div className="text-center py-12">
                  <Tag
                    className="h-12 w-12 mx-auto mb-4"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  />
                  <p className="font-poppins" style={{ color: "rgba(13,13,13,0.48)" }}>
                    No deals found
                  </p>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  {filteredDeals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
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

      <CreateDealDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingDeal(null);
        }}
        onCreateDeal={editingDeal ? handleUpdateDeal : handleCreateDeal}
        initialData={
          editingDeal && (editingDeal as any).backendData
            ? {
                dealName: (editingDeal as any).backendData.dealName,
                description: (editingDeal as any).backendData.description,
                category: (editingDeal as any).backendData.category,
                notes: (editingDeal as any).backendData.notes || "",
                existingImageUrl: (editingDeal as any).backendData.mainImage
                  ?.url,
                status: (editingDeal as any).backendData.status,
                priority: String((editingDeal as any).backendData.priority),
                tags: ((editingDeal as any).backendData.tags || []).join(", "),
                isPublished: (editingDeal as any).backendData.isPublished,
                startDate: (editingDeal as any).backendData.startDate,
                endDate: (editingDeal as any).backendData.endDate,
                dealType: (editingDeal as any).backendData.dealType || "regular",
              }
            : undefined
        }
        mode={editingDeal ? "edit" : "create"}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteDeal}
        title="Delete Deal"
        description="Are you sure you want to delete this deal? This action cannot be undone."
      />
    </VendorLayout>
  );
}
