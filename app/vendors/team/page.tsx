"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Pencil, KeyRound, UserX, UserCheck } from "lucide-react";
import { VendorLayout } from "@/components/vendors/vendor-layout";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/vendors/delete-confirmation-dialog";
import {
  CreateTeamMemberDialog,
  EditTeamMemberDialog,
  ResetTeamPasswordDialog,
} from "@/components/vendors/team-member-dialogs";
import { useToast } from "@/hooks/use-toast";
import {
  createTeamMember,
  getTeam,
  resetTeamMemberPassword,
  STAFF_ROLES,
  updateTeamMember,
  type StaffRole,
  type VendorStaff,
} from "@/lib/team";

function roleLabel(role: StaffRole): string {
  return STAFF_ROLES.find((item) => item.value === role)?.label || role;
}

export default function VendorTeamPage() {
  const { toast } = useToast();
  const [members, setMembers] = useState<VendorStaff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<VendorStaff | null>(null);
  const [passwordMember, setPasswordMember] = useState<VendorStaff | null>(
    null,
  );
  const [deactivateMember, setDeactivateMember] = useState<VendorStaff | null>(
    null,
  );

  const loadTeam = async () => {
    setIsLoading(true);
    setError(null);
    const result = await getTeam();
    if (result.success && result.data) {
      setMembers(result.data);
    } else {
      setError(result.error || "Failed to load team members");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleCreate = async (data: {
    name: string;
    email: string;
    password: string;
    role: StaffRole;
  }) => {
    const result = await createTeamMember(data);
    if (!result.success) {
      toast({
        title: "Couldn't add member",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
      return false;
    }

    if (result.data) {
      setMembers((prev) => [result.data as VendorStaff, ...prev]);
    } else {
      await loadTeam();
    }

    toast({
      title: "Team member added",
      description: `${data.name} can now sign in on the vendor login page.`,
    });
    return true;
  };

  const handleEdit = async (data: {
    name: string;
    role: StaffRole;
    isActive: boolean;
  }) => {
    if (!editingMember) return false;

    const result = await updateTeamMember(editingMember._id, data);
    if (!result.success) {
      toast({
        title: "Couldn't update member",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
      return false;
    }

    setMembers((prev) =>
      prev.map((member) =>
        member._id === editingMember._id
          ? { ...member, ...data, ...(result.data || {}) }
          : member,
      ),
    );
    toast({
      title: "Team member updated",
      description: "Changes have been saved.",
    });
    return true;
  };

  const handleResetPassword = async (password: string) => {
    if (!passwordMember) return false;

    const result = await resetTeamMemberPassword(passwordMember._id, password);
    if (!result.success) {
      toast({
        title: "Couldn't reset password",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Password reset",
      description: `A new password was set for ${passwordMember.name}.`,
    });
    return true;
  };

  const handleToggleActive = async () => {
    if (!deactivateMember) return;

    const nextActive = !deactivateMember.isActive;
    const result = await updateTeamMember(deactivateMember._id, {
      isActive: nextActive,
    });

    if (!result.success) {
      toast({
        title: nextActive ? "Couldn't reactivate" : "Couldn't deactivate",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
      return;
    }

    setMembers((prev) =>
      prev.map((member) =>
        member._id === deactivateMember._id
          ? { ...member, isActive: nextActive }
          : member,
      ),
    );
    toast({
      title: nextActive ? "Member reactivated" : "Member deactivated",
      description: nextActive
        ? `${deactivateMember.name} can sign in again.`
        : `${deactivateMember.name} can no longer sign in.`,
    });
  };

  return (
    <VendorLayout pageTitle="Team">
      <div style={{ minHeight: "100vh", background: "#F0F0EE" }}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
            <div className="flex items-center gap-4 flex-1">
              <div
                className="flex items-center gap-3 px-6 py-3 rounded-full h-12 whitespace-nowrap"
                style={{ background: "#0D0D0D", border: "1px solid #0D0D0D" }}
              >
                <Users
                  className="w-5 h-5"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                >
                  {members.length}{" "}
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>
                    Team members
                  </span>
                </span>
              </div>
            </div>

            <Button
              onClick={() => setCreateOpen(true)}
              className="h-12 font-poppins font-medium md:w-auto w-full"
              style={{
                background: "#F0F0EE",
                color: "#0D0D0D",
                borderRadius: "40px",
                padding: "13px 28px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#E8E8E4")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#F0F0EE")
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add member
            </Button>
          </div>

          <div
            className="rounded-xl shadow-lg overflow-hidden"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(13,13,13,0.09)",
            }}
          >
            <div className="p-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <div
                    className="inline-block animate-spin rounded-full border-b-2 w-8 h-8 mb-4"
                    style={{ borderColor: "#3A3A38" }}
                  />
                  <p className="font-poppins" style={{ color: "rgba(13,13,13,0.48)" }}>
                    Loading team…
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <Users
                    className="h-12 w-12 mx-auto mb-4"
                    style={{ color: "rgba(13,13,13,0.2)" }}
                  />
                  <p className="font-poppins mb-4" style={{ color: "#0D0D0D" }}>
                    {error}
                  </p>
                  <Button
                    onClick={loadTeam}
                    className="font-poppins"
                    style={{
                      background: "#F0F0EE",
                      color: "#0D0D0D",
                      borderRadius: "40px",
                      padding: "13px 28px",
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-12">
                  <Users
                    className="h-12 w-12 mx-auto mb-4"
                    style={{ color: "rgba(13,13,13,0.2)" }}
                  />
                  <p className="font-poppins" style={{ color: "rgba(13,13,13,0.48)" }}>
                    No team members yet. Add someone to share portal access.
                  </p>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  {members.map((member) => (
                    <div
                      key={member._id}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-poppins font-semibold text-base text-gray-900 truncate">
                            {member.name}
                          </h3>
                          <span className="font-poppins text-xs font-medium px-2 py-0.5 rounded-full border bg-gray-50 text-gray-700 border-gray-200">
                            {roleLabel(member.role)}
                          </span>
                          <span
                            className={`font-poppins text-xs font-medium px-2 py-0.5 rounded-full border ${
                              member.isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-gray-100 text-gray-500 border-gray-200"
                            }`}
                          >
                            {member.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="font-poppins text-sm text-gray-500 truncate">
                          {member.email}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => setEditingMember(member)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          title="Edit role"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPasswordMember(member)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          title="Reset password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeactivateMember(member)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            member.isActive
                              ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                              : "text-gray-400 hover:text-emerald-700 hover:bg-emerald-50"
                          }`}
                          title={
                            member.isActive
                              ? "Deactivate member"
                              : "Reactivate member"
                          }
                        >
                          {member.isActive ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateTeamMemberDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
      />

      <EditTeamMemberDialog
        open={Boolean(editingMember)}
        member={editingMember}
        onOpenChange={(open) => {
          if (!open) setEditingMember(null);
        }}
        onSubmit={handleEdit}
      />

      <ResetTeamPasswordDialog
        open={Boolean(passwordMember)}
        member={passwordMember}
        onOpenChange={(open) => {
          if (!open) setPasswordMember(null);
        }}
        onSubmit={handleResetPassword}
      />

      <DeleteConfirmationDialog
        open={Boolean(deactivateMember)}
        onOpenChange={(open) => {
          if (!open) setDeactivateMember(null);
        }}
        onConfirm={handleToggleActive}
        title={
          deactivateMember?.isActive
            ? "Deactivate team member?"
            : "Reactivate team member?"
        }
        description={
          deactivateMember?.isActive
            ? `${deactivateMember.name} will no longer be able to sign in. You can reactivate them later.`
            : `${deactivateMember?.name || "This member"} will be able to sign in again.`
        }
        confirmText={deactivateMember?.isActive ? "Deactivate" : "Reactivate"}
      />
    </VendorLayout>
  );
}
