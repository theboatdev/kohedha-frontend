"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Calendar,
  Clock,
  Users,
  MapPin,
  User,
  Phone,
} from "lucide-react";
import {
  createReservation,
  formatTime12Hour,
  type BookingSlotDetails,
} from "@/lib/publicBooking";

interface BookingStepThreeProps {
  bookingSlot: BookingSlotDetails;
  token: string;
  selectedDate: Date | null;
  numberOfGuests: number;
  selectedStartTime: string;
  selectedEndTime: string;
  selectedTable: string | null;
  customerName: string;
  customerPhone: string;
  onBack: () => void;
}

export function BookingStepThree({
  bookingSlot,
  token,
  selectedDate,
  numberOfGuests,
  selectedStartTime,
  selectedEndTime,
  selectedTable,
  customerName,
  customerPhone,
  onBack,
}: BookingStepThreeProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleConfirmBooking = async () => {
    if (!selectedTable) return;
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // For recurring slots, pass the customer-selected date
      const reservationDate =
        bookingSlot.isRecurring && selectedDate
          ? selectedDate.toISOString().split("T")[0]
          : undefined;

      const result = await createReservation(token, {
        tableId: selectedTable,
        customerName,
        customerPhone,
        numberOfGuests,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        reservationDate,
      });

      // Redirect to success page with confirmation token
      if (result.success && result.data) {
        router.push(`/book/success/${result.data.confirmationToken}`);
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to create reservation. Please try again.",
      );
      // Reset reCAPTCHA on failure so the user can try again
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Determine the date to display in the summary
  const displayDate = bookingSlot.isRecurring
    ? selectedDate
    : bookingSlot.date
      ? new Date(bookingSlot.date)
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
          Confirm Your Reservation
        </h2>
        <p className="text-gray-600 font-poppins">
          Please review your booking details before confirming
        </p>
      </div>

      {/* Booking Summary */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        {/* Venue Info */}
        <div className="bg-gray-50 p-6 border-b border-gray-200">
          <h3 className="text-xl font-playfair font-bold text-gray-900 mb-2">
            {bookingSlot.vendor.name}
          </h3>
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="font-poppins text-sm">
              {bookingSlot.vendor.address}, {bookingSlot.vendor.city}
            </p>
          </div>
        </div>

        {/* Reservation Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-poppins">Date</p>
                <p className="font-poppins font-semibold text-gray-900">
                  {displayDate
                    ? displayDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-poppins">Time</p>
                <p className="font-poppins font-semibold text-gray-900">
                  {formatTime12Hour(selectedStartTime)} -{" "}
                  {formatTime12Hour(selectedEndTime)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-poppins">Party Size</p>
                <p className="font-poppins font-semibold text-gray-900">
                  {numberOfGuests} {numberOfGuests === 1 ? "Guest" : "Guests"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-poppins">Section</p>
                <p className="font-poppins font-semibold text-gray-900">
                  {bookingSlot.section.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <h4 className="font-poppins font-semibold text-gray-900 mb-3">
            Contact Information
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4" />
              <span className="font-poppins">{customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4" />
              <span className="font-poppins">{customerPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-poppins text-sm">{error}</p>
        </div>
      )}

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-poppins font-semibold text-amber-900 mb-2">
          Important Information
        </h3>
        <ul className="text-sm text-amber-800 font-poppins space-y-1 list-disc list-inside">
          <li>
            Your reservation will be pending until the restaurant confirms it
          </li>
          <li>The restaurant will contact you via phone to confirm</li>
          <li>Please arrive on time once your reservation is confirmed</li>
          <li>You can cancel your reservation using the confirmation link</li>
        </ul>
      </div>

      {/* reCAPTCHA */}
      <div className="flex justify-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={(token) => setRecaptchaToken(token)}
          onExpired={() => setRecaptchaToken(null)}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="px-8 font-poppins"
          size="lg"
          disabled={loading}
        >
          Back
        </Button>
        <Button
          onClick={handleConfirmBooking}
          className="px-8 font-poppins"
          size="lg"
          disabled={loading || !recaptchaToken}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Reservation"
          )}
        </Button>
      </div>
    </div>
  );
}
