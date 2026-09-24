"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import {
  getImpersonationStatus,
  endImpersonationSession,
} from "@/lib/auth";

// Shows a persistent, unmissable banner whenever the current session is an
// admin impersonating this vendor account - so it's never ambiguous whose
// session is active, and gives a clean way to end it from the vendor side
// instead of the session just dying mid-use with a confusing error.
export function ImpersonationBanner() {
  const router = useRouter();
  const [status, setStatus] = useState<{
    isImpersonating: boolean;
    adminEmail?: string;
    adminName?: string;
  } | null>(null);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getImpersonationStatus().then((result) => {
      if (!cancelled) setStatus(result);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!status?.isImpersonating) return null;

  const handleEndSession = async () => {
    setEnding(true);
    try {
      await endImpersonationSession();
    } finally {
      // Whether or not the API call succeeded, the impersonation cookie is
      // no longer something this browser should keep relying on - send it
      // back to the vendor login rather than leaving it on a dead session.
      router.push("/vendors/login");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        flexWrap: "wrap",
        padding: "10px 20px",
        background: "#FEF3C7",
        borderBottom: "1px solid #FBBF24",
        fontSize: "13px",
        color: "#78350F",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ShieldAlert style={{ width: 16, height: 16, flexShrink: 0 }} />
        <span>
          <strong>Admin view:</strong>{" "}
          {status.adminEmail
            ? `${status.adminName || "An admin"} (${status.adminEmail})`
            : "An admin"}{" "}
          is currently viewing this account on your behalf.
        </span>
      </div>
      <button
        onClick={handleEndSession}
        disabled={ending}
        style={{
          background: "#78350F",
          color: "#FEF3C7",
          border: "none",
          borderRadius: "8px",
          padding: "6px 14px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: ending ? "default" : "pointer",
          opacity: ending ? 0.7 : 1,
          flexShrink: 0,
        }}
      >
        {ending ? "Ending..." : "End Session"}
      </button>
    </div>
  );
}
