"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookingStepOne } from "@/components/booking/booking-step-one";
import { BookingStepTwo } from "@/components/booking/booking-step-two";
import { BookingStepThree } from "@/components/booking/booking-step-three";
import {
  getBookingSlotDetails,
  type BookingSlotDetails,
} from "@/lib/publicBooking";
import { Loader2 } from "lucide-react";
import { C } from "@/lib/brand-theme";

export default function PublicBookingPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingSlot, setBookingSlot] = useState<BookingSlotDetails | null>(
    null,
  );
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    fetchBookingSlot();
  }, [token]);

  const fetchBookingSlot = async () => {
    try {
      setLoading(true);
      const data = await getBookingSlotDetails(token);
      setBookingSlot(data);
      // For single-date slots, pre-set the date; for recurring, customer picks
      if (!data.isRecurring && data.date) {
        setSelectedDate(new Date(data.date));
      }
    } catch (err: any) {
      setError(err.message || "Failed to load booking slot");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div
        className="font-dm-sans"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.bg,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Loader2
            style={{
              width: 48,
              height: 48,
              color: C.accent,
              margin: "0 auto 16px",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: C.muted }}>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !bookingSlot) {
    return (
      <div
        className="font-dm-sans"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.bg,
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            background: C.cream,
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            border: "1px solid rgba(13,13,13,0.1)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "rgba(229,57,53,0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: "#E53935" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1
            className="font-display"
            style={{ fontSize: "26px", color: C.text, marginBottom: "10px" }}
          >
            Booking Not Found
          </h1>
          <p style={{ color: C.muted, marginBottom: "28px", lineHeight: 1.7 }}>
            {error || "This booking link is invalid or has expired."}
          </p>
          <button
            onClick={() => router.push("/")}
            style={{
              background: C.accent,
              color: C.text,
              border: "none",
              borderRadius: "40px",
              padding: "12px 28px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const stepLabels = ["Select Time & Table", "Your Details", "Confirm Booking"];

  return (
    <div
      className="font-dm-sans"
      style={{ minHeight: "100vh", background: C.bg, padding: "40px 24px" }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Venue header */}
        <div
          style={{
            background: C.cream,
            borderRadius: "16px",
            border: "1px solid rgba(13,13,13,0.08)",
            padding: "24px 28px",
            marginBottom: "20px",
          }}
        >
          <h1
            className="font-display"
            style={{ fontSize: "28px", color: C.text, marginBottom: "6px" }}
          >
            {bookingSlot.vendor.name}
          </h1>
          <p style={{ color: C.muted, fontSize: "14px" }}>
            {bookingSlot.vendor.address}, {bookingSlot.vendor.city}
          </p>
        </div>

        {/* Progress steps */}
        <div
          style={{
            background: C.cream,
            borderRadius: "16px",
            border: "1px solid rgba(13,13,13,0.08)",
            padding: "24px 28px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                style={{ display: "flex", alignItems: "center", flex: 1 }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: "15px",
                      transition: "all 0.2s",
                      background: currentStep >= step ? C.accent : C.bg2,
                      color: currentStep >= step ? C.text : C.muted,
                    }}
                  >
                    {step}
                  </div>
                  <p
                    style={{
                      marginTop: "8px",
                      fontSize: "11px",
                      fontWeight: currentStep >= step ? 600 : 400,
                      color: currentStep >= step ? C.text : C.muted,
                      textAlign: "center",
                    }}
                  >
                    {stepLabels[step - 1]}
                  </p>
                </div>
                {step < 3 && (
                  <div
                    style={{
                      height: "2px",
                      flex: 1,
                      margin: "0 8px 20px",
                      borderRadius: "2px",
                      background: currentStep > step ? C.accent : C.bg2,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div
          style={{
            background: C.cream,
            borderRadius: "16px",
            border: "1px solid rgba(13,13,13,0.08)",
            padding: "28px",
          }}
        >
          {currentStep === 1 && (
            <BookingStepOne
              bookingSlot={bookingSlot}
              token={token}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              numberOfGuests={numberOfGuests}
              setNumberOfGuests={setNumberOfGuests}
              selectedStartTime={selectedStartTime}
              setSelectedStartTime={setSelectedStartTime}
              selectedEndTime={selectedEndTime}
              setSelectedEndTime={setSelectedEndTime}
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              onNext={handleNext}
            />
          )}
          {currentStep === 2 && (
            <BookingStepTwo
              customerName={customerName}
              setCustomerName={setCustomerName}
              customerPhone={customerPhone}
              setCustomerPhone={setCustomerPhone}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <BookingStepThree
              bookingSlot={bookingSlot}
              token={token}
              selectedDate={selectedDate}
              numberOfGuests={numberOfGuests}
              selectedStartTime={selectedStartTime}
              selectedEndTime={selectedEndTime}
              selectedTable={selectedTable}
              customerName={customerName}
              customerPhone={customerPhone}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}
