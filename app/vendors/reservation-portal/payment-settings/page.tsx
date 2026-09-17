"use client";

import { useState, useEffect } from "react";
import { ReservationPortalLayout } from "@/components/vendors/reservation-portal-layout";
import { Loader2, CreditCard, CheckCircle, XCircle, Info } from "lucide-react";
import { getPaymentSettings } from "@/lib/paymentSettings";

const GATEWAY_LABELS: Record<string, string> = {
  platform_default: "Platform Default (PayHere)",
  payhere: "PayHere – Custom Credentials",
  none: "None (Disabled)",
};

export default function PaymentSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
  const [preferredGateway, setPreferredGateway] = useState("platform_default");
  const [hasMerchantId, setHasMerchantId] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await getPaymentSettings();
        const raw = response as any;
        const settings = raw.paymentSettings || raw.data;
        if (raw.success && settings) {
          setIsPaymentEnabled(settings.isPaymentEnabled !== false);
          setPreferredGateway(settings.preferredGateway || "platform_default");
          setHasMerchantId(!!settings.gatewayCredentials?.payhere?.merchantId);
        }
      } catch (error) {
        console.error("Error fetching payment settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <ReservationPortalLayout pageTitle="Payment Settings">
      <div
        className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:py-12"
        style={{ background: "#F0F0EE" }}
      >
        <div
          className="rounded-xl shadow-lg overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid rgba(13,13,13,0.09)" }}
        >
          <div className="p-6" style={{ borderBottom: "1px solid rgba(13,13,13,0.09)" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-gray-700" />
              </div>
              <h2 className="font-poppins font-bold text-2xl tracking-tight" style={{ color: "#0D0D0D" }}>
                Payment Gateway Settings
              </h2>
            </div>
            <p className="font-poppins text-sm ml-11" style={{ color: "rgba(13,13,13,0.48)" }}>
              Payment gateway credentials are managed by your Kohedha administrator.
            </p>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" style={{ color: "#0D0D0D" }} />
                <p className="font-poppins text-sm" style={{ color: "rgba(13,13,13,0.48)" }}>
                  Loading payment settings...
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center gap-4 p-4 rounded-xl border bg-gray-50">
                  {isPaymentEnabled ? (
                    <CheckCircle className="h-8 w-8 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="h-8 w-8 text-gray-400 shrink-0" />
                  )}
                  <div>
                    <p className="font-poppins font-semibold text-gray-900">
                      {isPaymentEnabled ? "Payments Enabled" : "Payments Disabled"}
                    </p>
                    <p className="font-poppins text-sm text-gray-500 mt-0.5">
                      {isPaymentEnabled
                        ? "Customers will be prompted to pay a deposit when booking paid slots."
                        : "No deposits will be collected from customers."}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border bg-gray-50 space-y-1">
                  <p className="font-poppins text-xs font-medium text-gray-400 uppercase tracking-wide">Active Gateway</p>
                  <p className="font-poppins font-semibold text-gray-900">
                    {GATEWAY_LABELS[preferredGateway] || preferredGateway}
                  </p>
                  {preferredGateway === "payhere" && (
                    <p className="font-poppins text-sm text-gray-500">
                      {hasMerchantId ? "Custom merchant credentials are configured." : "No custom credentials set."}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 p-4 rounded-xl border border-blue-100 bg-blue-50">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="font-poppins text-sm text-blue-700">
                    To change your payment gateway or update credentials, please contact your Kohedha administrator.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ReservationPortalLayout>
  );
}