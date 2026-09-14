"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PasswordStrengthHelper } from "@/components/vendors/password-strength-helper";
import { isPasswordValid } from "@/lib/password-validation";
import {
  STAFF_ROLES,
  type StaffRole,
  type VendorStaff,
} from "@/lib/team";

const PASSWORD_HELPER_COLORS = {
  text: "#3A3A38",
  muted: "#8A8A86",
  accent: "#16a34a",
};

type CreateTeamMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    role: StaffRole;
  }) => Promise<boolean>;
};

export function CreateTeamMemberDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateTeamMemberDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("staff");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPassword("");
      setRole("staff");
      setError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isPasswordValid(password)) {
      setError("Please ensure the password meets all requirements.");
      return;
    }

    setIsSubmitting(true);
    const ok = await onSubmit({
      name: trimmedName,
      email: trimmedEmail,
      password,
      role,
    });
    setIsSubmitting(false);
    if (ok) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-2xl tracking-tight">
            Add team member
          </DialogTitle>
          <DialogDescription className="font-poppins text-sm">
            Create a login for someone on your team. They will use the vendor
            portal with the permissions of their role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="team-name" className="text-sm font-medium font-poppins">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="team-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="font-poppins"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-email" className="text-sm font-medium font-poppins">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="team-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="font-poppins"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-role" className="text-sm font-medium font-poppins">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as StaffRole)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="team-role" className="font-poppins">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="font-poppins"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-password" className="text-sm font-medium font-poppins">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="team-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set a password"
              className="font-poppins"
              disabled={isSubmitting}
              required
            />
            <PasswordStrengthHelper
              password={password}
              colors={PASSWORD_HELPER_COLORS}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-poppins">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="font-poppins"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-black hover:bg-gray-900 text-white font-poppins"
            >
              {isSubmitting ? "Creating…" : "Create member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type EditTeamMemberDialogProps = {
  open: boolean;
  member: VendorStaff | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    role: StaffRole;
    isActive: boolean;
  }) => Promise<boolean>;
};

export function EditTeamMemberDialog({
  open,
  member,
  onOpenChange,
  onSubmit,
}: EditTeamMemberDialogProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffRole>("staff");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && member) {
      setName(member.name);
      setRole(member.role);
      setIsActive(member.isActive);
      setError(null);
      setIsSubmitting(false);
    }
  }, [member, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    setIsSubmitting(true);
    const ok = await onSubmit({ name: trimmedName, role, isActive });
    setIsSubmitting(false);
    if (ok) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-2xl tracking-tight">
            Edit team member
          </DialogTitle>
          <DialogDescription className="font-poppins text-sm">
            Update name, role, or active status. Deactivated members cannot sign
            in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-team-name" className="text-sm font-medium font-poppins">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-team-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-poppins"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-team-role" className="text-sm font-medium font-poppins">
              Role
            </Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as StaffRole)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="edit-team-role" className="font-poppins">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="font-poppins"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[#E8E8E4] px-4 py-3">
            <div>
              <p className="font-poppins text-sm font-medium text-[#3A3A38]">
                Active
              </p>
              <p className="font-poppins text-xs text-[#8A8A86]">
                Inactive members cannot log in
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-poppins">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="font-poppins"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-black hover:bg-gray-900 text-white font-poppins"
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type ResetTeamPasswordDialogProps = {
  open: boolean;
  member: VendorStaff | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (password: string) => Promise<boolean>;
};

export function ResetTeamPasswordDialog({
  open,
  member,
  onOpenChange,
  onSubmit,
}: ResetTeamPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid(password)) {
      setError("Please ensure the password meets all requirements.");
      return;
    }

    setIsSubmitting(true);
    const ok = await onSubmit(password);
    setIsSubmitting(false);
    if (ok) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-2xl tracking-tight">
            Reset password
          </DialogTitle>
          <DialogDescription className="font-poppins text-sm">
            Set a new password for {member?.name || "this team member"}. They
            will use it on the vendor login page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="reset-team-password" className="text-sm font-medium font-poppins">
              New password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reset-team-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="font-poppins"
              disabled={isSubmitting}
              required
            />
            <PasswordStrengthHelper
              password={password}
              colors={PASSWORD_HELPER_COLORS}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-poppins">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="font-poppins"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-black hover:bg-gray-900 text-white font-poppins"
            >
              {isSubmitting ? "Saving…" : "Reset password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
