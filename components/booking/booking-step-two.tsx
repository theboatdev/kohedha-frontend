"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone } from "lucide-react";

interface BookingStepTwoProps {
  customerName: string;
  setCustomerName: (value: string) => void;
  customerPhone: string;
  setCustomerPhone: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BookingStepTwo({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  onNext,
  onBack,
}: BookingStepTwoProps) {
  const isValidPhone = (phone: string) => {
    // Basic phone validation - adjust regex as needed
    return /^[0-9+\-\s()]{10,}$/.test(phone);
  };

  const canProceed =
    customerName.trim().length >= 2 &&
    customerPhone.trim().length >= 10 &&
    isValidPhone(customerPhone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canProceed) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
          Your Details
        </h2>
        <p className="text-gray-600 font-poppins">
          Please provide your contact information for the reservation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name */}
        <div>
          <Label
            htmlFor="customerName"
            className="text-base font-poppins font-medium mb-3 flex items-center gap-2"
          >
            <User className="w-5 h-5" />
            Full Name
          </Label>
          <Input
            id="customerName"
            type="text"
            placeholder="Enter your full name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="font-poppins"
            required
            minLength={2}
          />
          {customerName && customerName.length < 2 && (
            <p className="text-sm text-red-600 mt-1 font-poppins">
              Name must be at least 2 characters
            </p>
          )}
        </div>

        {/* Customer Phone */}
        <div>
          <Label
            htmlFor="customerPhone"
            className="text-base font-poppins font-medium mb-3 flex items-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Phone Number
          </Label>
          <Input
            id="customerPhone"
            type="tel"
            placeholder="+94 77 123 4567"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="font-poppins"
            required
          />
          {customerPhone && !isValidPhone(customerPhone) && (
            <p className="text-sm text-red-600 mt-1 font-poppins">
              Please enter a valid phone number
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1 font-poppins">
            We'll use this to send you booking confirmation and updates
          </p>
        </div>

        {/* Information Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-poppins font-semibold text-blue-900 mb-1">
            Privacy Notice
          </h3>
          <p className="text-sm text-blue-800 font-poppins">
            Your information will only be used to manage your reservation and
            will not be shared with third parties.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 pt-4">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="px-8 font-poppins"
            size="lg"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={!canProceed}
            className="px-8 font-poppins"
            size="lg"
          >
            Continue to Confirmation
          </Button>
        </div>
      </form>
    </div>
  );
}
