"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Share2, QrCode } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BookingLinkShareProps {
  publicToken: string;
  slotName: string;
}

export function BookingLinkShare({
  publicToken,
  slotName,
}: BookingLinkShareProps) {
  const [copied, setCopied] = useState(false);
  const bookingUrl = `${window.location.origin}/book/${publicToken}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Book a table - ${slotName}`,
          text: "Reserve your table now!",
          url: bookingUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playfair flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share Booking Link
        </CardTitle>
        <CardDescription className="font-poppins">
          Share this link with customers to let them book tables
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={bookingUrl}
            readOnly
            className="font-mono text-sm font-poppins"
          />
          <Button
            onClick={handleCopyLink}
            variant="outline"
            size="icon"
            className="flex-shrink-0"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleShare}
            className="flex-1 font-poppins"
            variant="outline"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Link
          </Button>
          <Button
            onClick={() => window.open(bookingUrl, "_blank")}
            className="flex-1 font-poppins"
          >
            Open Booking Page
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-poppins">
            💡 <strong>Tip:</strong> Share this link on social media, your
            website, or via WhatsApp to let customers book tables directly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
