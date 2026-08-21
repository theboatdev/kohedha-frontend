"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { redeemVoucherCode, type DealClaim } from "@/lib/deals";
import { CheckCircle2, XCircle, Loader2, RotateCcw } from "lucide-react";

type ResultState = {
  ok: boolean;
  message: string;
  claim?: DealClaim;
};

type RedeemVoucherDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatCodeInput(value: string): string {
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const first = cleaned.slice(0, 4);
  const second = cleaned.slice(4, 8);
  return second ? `${first}-${second}` : first;
}

function dealName(claim?: DealClaim) {
  return claim && typeof claim.dealId === "object" ? claim.dealId.dealName : null;
}

export function RedeemVoucherDialog({
  open,
  onOpenChange,
}: RedeemVoucherDialogProps) {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCode("");
      setResult(null);
      setIsSubmitting(false);
      // Focus after dialog mounts
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setResult(null);
    try {
      const res = await redeemVoucherCode(code.trim());
      setResult({
        ok: true,
        message: res.message || "Voucher redeemed successfully",
        claim: res.data,
      });
      toast({
        title: "Voucher redeemed",
        description: dealName(res.data)
          ? `${dealName(res.data)} — marked as used.`
          : "Marked as used.",
      });
    } catch (err: any) {
      setResult({
        ok: false,
        message: err?.message || "Failed to redeem voucher",
        claim: err?.data,
      });
    } finally {
      setIsSubmitting(false);
      setCode("");
      inputRef.current?.focus();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-2xl tracking-tight">
            Redeem Voucher
          </DialogTitle>
          <DialogDescription className="font-poppins text-sm">
            Ask the customer to show their voucher code, then type it in below.
            Each code can only be redeemed once — the server validates and marks
            it used immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Input
              ref={inputRef}
              placeholder="XXXX-XXXX"
              value={code}
              onChange={(e) => setCode(formatCodeInput(e.target.value))}
              maxLength={9}
              className="font-poppins text-lg tracking-widest text-center sm:text-left"
            />
            <Button
              type="submit"
              disabled={!code.trim() || isSubmitting}
              className="bg-black hover:bg-gray-900 font-poppins min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking…
                </>
              ) : (
                "Redeem"
              )}
            </Button>
          </form>

          {result && (
            <div
              className="rounded-xl border p-5 flex items-start gap-3"
              style={{
                background: result.ok
                  ? "rgba(16,185,129,0.06)"
                  : "rgba(239,68,68,0.06)",
                borderColor: result.ok
                  ? "rgba(16,185,129,0.3)"
                  : "rgba(239,68,68,0.3)",
              }}
            >
              {result.ok ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="font-poppins font-semibold text-sm"
                  style={{ color: result.ok ? "#065f46" : "#991b1b" }}
                >
                  {result.ok ? "Success" : "Not redeemed"}
                </p>
                <p className="font-poppins text-sm text-gray-700 mt-0.5">
                  {result.message}
                </p>
                {dealName(result.claim) && (
                  <p className="font-poppins text-xs text-gray-500 mt-2">
                    Deal:{" "}
                    <span className="font-medium">
                      {dealName(result.claim)}
                    </span>
                  </p>
                )}
                {result.claim?.code && (
                  <p className="font-poppins text-xs text-gray-400 mt-1 tracking-widest">
                    Code: {result.claim.code}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setResult(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white/60 transition-colors flex-shrink-0"
                title="Clear"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
