"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getReservationDetails,
  cancelReservation,
  formatTime12Hour,
  type ReservationDetails,
} from "@/lib/publicBooking";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  MapPin,
  User,
  Phone,
  Loader2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { C } from "@/lib/brand-theme";

export default function BookingSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const confirmationToken = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    fetchReservation();
  }, [confirmationToken]);

  const fetchReservation = async () => {
    try {
      setLoading(true);
      const data = await getReservationDetails(confirmationToken);
      setReservation(data);
      setCancelled(data.status === "cancelled");
    } catch (err: any) {
      setError(err.message || "Failed to load reservation");
    } finally {
      setLoading(false);
    }
  };

  const canCancel =
    reservation &&
    reservation.status !== "cancelled" &&
    reservation.status !== "completed" &&
    new Date(reservation.reservationDate) > new Date();

  const handleCancelReservation = async () => {
    if (!reservation) return;
    try {
      setCancelling(true);
      await cancelReservation(confirmationToken, "Customer requested cancellation");
      setCancelled(true);
      await fetchReservation();
    } catch (err: any) {
      alert(err.message || "Failed to cancel reservation");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="font-dm-sans" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 style={{ width: 48, height: 48, color: C.accent, margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
          <p style={{ color: C.muted }}>Loading reservation...</p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="font-dm-sans" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: "24px" }}>
        <div style={{ maxWidth: "420px", width: "100%", background: C.cream, borderRadius: "20px", padding: "40px", textAlign: "center", border: "1px solid rgba(13,13,13,0.1)" }}>
          <div style={{ width: "64px", height: "64px", background: "rgba(229,57,53,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <XCircle style={{ width: 32, height: 32, color: "#E53935" }} />
          </div>
          <h1 className="font-display" style={{ fontSize: "26px", color: C.text, marginBottom: "10px" }}>Reservation Not Found</h1>
          <p style={{ color: C.muted, marginBottom: "28px", lineHeight: 1.7 }}>{error || "This reservation link is invalid or has expired."}</p>
          <button
            onClick={() => router.push("/")}
            style={{ background: C.accent, color: "white", border: "none", borderRadius: "40px", padding: "12px 28px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const isConfirmed = reservation.status === "confirmed";
  const isPending = reservation.status === "pending";

  return (
    <div className="font-dm-sans" style={{ minHeight: "100vh", background: C.bg, padding: "48px 24px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Status header */}
        {!cancelled ? (
          <div style={{ background: C.cream, borderRadius: "20px", border: "1px solid rgba(13,13,13,0.08)", padding: "40px", textAlign: "center", marginBottom: "20px" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
              background: isConfirmed ? "rgba(76,175,80,0.12)" : "rgba(251,140,0,0.12)",
            }}>
              <CheckCircle2 style={{ width: 40, height: 40, color: isConfirmed ? "#4CAF50" : "#FB8C00" }} />
            </div>
            <h1 className="font-display" style={{ fontSize: "32px", color: C.text, marginBottom: "8px" }}>
              {isConfirmed ? "Reservation Confirmed!" : "Reservation Received!"}
            </h1>
            <p style={{ color: C.muted, fontSize: "15px", lineHeight: 1.7, marginBottom: "20px" }}>
              {isConfirmed ? "Your table has been confirmed by the restaurant." : "Awaiting confirmation from the restaurant."}
            </p>
            <div style={{ display: "inline-block", background: C.bg2, borderRadius: "12px", padding: "12px 24px" }}>
              <p style={{ fontSize: "12px", color: C.muted, marginBottom: "4px" }}>Confirmation Number</p>
              <p style={{ fontSize: "20px", fontFamily: "monospace", fontWeight: 700, color: C.text }}>
                {reservation._id.slice(-8).toUpperCase()}
              </p>
            </div>
            {isPending && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(251,140,0,0.1)", color: "#FB8C00", borderRadius: "40px", padding: "8px 18px", fontSize: "13px", fontWeight: 600, marginTop: "16px", marginLeft: "12px" }}>
                <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status: Pending Confirmation
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: C.cream, borderRadius: "20px", border: "1px solid rgba(13,13,13,0.08)", padding: "40px", textAlign: "center", marginBottom: "20px" }}>
            <div style={{ width: "72px", height: "72px", background: "rgba(229,57,53,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <XCircle style={{ width: 40, height: 40, color: "#E53935" }} />
            </div>
            <h1 className="font-display" style={{ fontSize: "32px", color: C.text, marginBottom: "8px" }}>Reservation Cancelled</h1>
            <p style={{ color: C.muted, fontSize: "15px" }}>This reservation has been cancelled.</p>
          </div>
        )}

        {/* Reservation details */}
        <div style={{ background: C.cream, borderRadius: "20px", border: "1px solid rgba(13,13,13,0.08)", overflow: "hidden", marginBottom: "20px" }}>
          {/* Venue */}
          <div style={{ background: C.bg2, padding: "22px 28px", borderBottom: "1px solid rgba(13,13,13,0.08)" }}>
            <h2 className="font-display" style={{ fontSize: "24px", color: C.text, marginBottom: "8px" }}>
              {reservation.vendorId?.companyName || reservation.vendorId?.location?.businessName || "Restaurant"}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: C.muted, fontSize: "13px" }}>
              <MapPin style={{ width: 14, height: 14, flexShrink: 0 }} />
              <span>{reservation.vendorId?.location?.streetAddress}, {reservation.vendorId?.location?.city}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: C.muted, fontSize: "13px", marginTop: "6px" }}>
              <Phone style={{ width: 14, height: 14 }} />
              <span>{reservation.vendorId?.vendorMobile}</span>
            </div>
          </div>

          {/* Booking details */}
          <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontWeight: 600, color: C.text, fontSize: "16px" }}>Booking Details</h3>
              <span style={{
                padding: "5px 14px", borderRadius: "40px", fontSize: "12px", fontWeight: 600,
                background: isConfirmed ? "rgba(76,175,80,0.1)" : isPending ? "rgba(251,140,0,0.1)" : "rgba(229,57,53,0.1)",
                color: isConfirmed ? "#4CAF50" : isPending ? "#FB8C00" : "#E53935",
              }}>
                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { Icon: Calendar, label: "Date", value: new Date(reservation.reservationDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) },
                { Icon: Clock, label: "Time", value: `${formatTime12Hour(reservation.startTime)} – ${formatTime12Hour(reservation.endTime)}` },
                { Icon: Users, label: "Party Size", value: `${reservation.numberOfGuests} ${reservation.numberOfGuests === 1 ? "Guest" : "Guests"}` },
              ].map(({ Icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", background: C.dark, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon style={{ width: 16, height: 16, color: "white" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: C.muted, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                    <p style={{ fontWeight: 600, color: C.text, fontSize: "13px" }}>{value}</p>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", background: C.dark, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg style={{ width: 16, height: 16, color: "white" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: C.muted, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Table</p>
                  <p style={{ fontWeight: 600, color: C.text, fontSize: "13px" }}>{reservation.tableId?.tableNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guest info */}
          <div style={{ background: C.bg2, padding: "20px 28px", borderTop: "1px solid rgba(13,13,13,0.08)" }}>
            <h3 style={{ fontWeight: 600, color: C.text, fontSize: "14px", marginBottom: "12px" }}>Guest Information</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: C.muted }}>
                <User style={{ width: 14, height: 14 }} /><span>{reservation.customerName}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: C.muted }}>
                <Phone style={{ width: 14, height: 14 }} /><span>{reservation.customerPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info notice */}
        <div style={{
          borderRadius: "16px", padding: "20px 24px", marginBottom: "24px",
          background: isPending ? "rgba(251,140,0,0.08)" : "rgba(245,230,66,0.08)",
          border: `1px solid ${isPending ? "rgba(251,140,0,0.2)" : "rgba(245,230,66,0.2)"}`,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <AlertCircle style={{ width: 18, height: 18, flexShrink: 0, marginTop: "2px", color: isPending ? "#FB8C00" : C.accent }} />
            <div>
              <h3 style={{ fontWeight: 600, fontSize: "14px", marginBottom: "10px", color: isPending ? "#B45309" : C.accent }}>
                {isPending ? "Next Steps" : "What to Expect"}
              </h3>
              <ul style={{ fontSize: "13px", color: C.muted, lineHeight: 1.8, paddingLeft: "16px" }}>
                {isPending ? (
                  <>
                    <li>The restaurant will review and confirm your reservation</li>
                    <li>You will receive a call or message once confirmed</li>
                    <li>Save this page URL to check your reservation status</li>
                    <li>Please arrive on time once confirmed</li>
                  </>
                ) : (
                  <>
                    <li>Please arrive on time for your reservation</li>
                    <li>Save this page URL to view your reservation details later</li>
                    <li>The restaurant may call you to confirm your booking</li>
                    <li>Please inform the staff about any dietary requirements upon arrival</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => router.push("/")}
            style={{ flex: 1, minWidth: "160px", background: "transparent", color: C.text, border: `1px solid rgba(13,13,13,0.2)`, borderRadius: "40px", padding: "14px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            Back to Home
          </button>

          {!cancelled && canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button style={{ flex: 1, minWidth: "160px", background: "#E53935", color: "white", border: "none", borderRadius: "40px", padding: "14px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                  Cancel Reservation
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">Cancel Reservation?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this reservation? This action cannot be undone. Please contact the restaurant if you need to make changes instead.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelReservation}
                    disabled={cancelling}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {cancelling ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Cancelling...</>
                    ) : (
                      "Yes, Cancel Reservation"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
