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
import {
  recordLoyaltyStamp,
  type DealLoyaltyCard,
  type DealClaim,
} from "@/lib/deals";
import { CheckCircle2, XCircle, Loader2, RotateCcw, Gift, Stamp } from "lucide-react";

type ResultState = {
  ok: boolean;
  message: string;
  card?: DealLoyaltyCard;
  stampsRequired?: number;
  rewardClaim?: DealClaim | null;
};

type StampLoyaltyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatCodeInput(value: string): string {
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const first = cleaned.slice(0, 4);
  const second = cleaned.slice(4, 8);
  return second ? `${first}-${second}` : first;
}

function dealName(card?: DealLoyaltyCard) {
  return card && typeof card.dealId === "object" ? card.dealId.dealName : null;
}

export function StampLoyaltyDialog({
  open,
  onOpenChange,
}: StampLoyaltyDialogProps) {
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
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setResult(null);
    try {
      const res = await recordLoyaltyStamp(code.trim());
      const card = res.data?.card;
      const rewardClaim = res.data?.rewardClaim ?? null;
      setResult({
        ok: true,
        message:
          res.message ||
          (rewardClaim ? "Reward unlocked!" : "Stamp added"),
        card,
        stampsRequired: res.data?.stampsRequired,
        rewardClaim,
      });
      toast({
        title: rewardClaim ? "Reward unlocked!" : "Stamp added",
        description: rewardClaim
          ? `Reward code ${rewardClaim.code} minted for the customer.`
          : dealName(card)
            ? `${dealName(card)} — ${card?.stampCount ?? 0}/${
                res.data?.stampsRequired ?? "?"
              } stamps.`
            : "Stamp recorded.",
      });
    } catch (err: any) {
      setResult({
        ok: false,
        message: err?.message || "Failed to record loyalty stamp",
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
            Add Loyalty Stamp
          </DialogTitle>
          <DialogDescription className="font-poppins text-sm">
            Ask the customer to show their loyalty card code, then type it in
            below. Crossing the stamp threshold automatically mints a
            single-use reward code for them.
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
                  Stamping…
                </>
              ) : (
                <>
                  <Stamp className="mr-2 h-4 w-4" />
                  Add Stamp
                </>
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
                result.rewardClaim ? (
                  <Gift className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                )
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="font-poppins font-semibold text-sm"
                  style={{ color: result.ok ? "#065f46" : "#991b1b" }}
                >
                  {result.ok
                    ? result.rewardClaim
                      ? "Reward unlocked!"
                      : "Success"
                    : "Not recorded"}
                </p>
                <p className="font-poppins text-sm text-gray-700 mt-0.5">
                  {result.message}
                </p>
                {dealName(result.card) && (
                  <p className="font-poppins text-xs text-gray-500 mt-2">
                    Deal:{" "}
                    <span className="font-medium">{dealName(result.card)}</span>
                  </p>
                )}
                {result.card && (
                  <p className="font-poppins text-xs text-gray-500 mt-1">
                    Progress:{" "}
                    <span className="font-medium">
                      {result.card.stampCount}/{result.stampsRequired ?? "?"}
                    </span>{" "}
                    stamps
                  </p>
                )}
                {result.rewardClaim?.code && (
                  <p className="font-poppins text-xs text-gray-400 mt-1 tracking-widest">
                    Reward code: {result.rewardClaim.code}
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
