import type { Metadata } from "next";

interface BookingPageProps {
  params: { token: string };
}

export async function generateMetadata({
  params,
}: BookingPageProps): Promise<Metadata> {
  // In a real implementation, you'd fetch the booking slot details here
  // For now, we'll return dynamic metadata structure

  return {
    title: "Book Your Table | Restaurant Reservation",
    description:
      "Reserve your table now! View available times and make your booking in just a few clicks.",
    openGraph: {
      title: "Book Your Table",
      description: "Reserve your table now! Quick and easy online booking.",
      type: "website",
      images: [
        {
          url: "/og-booking.jpg", // You can create a default OG image
          width: 1200,
          height: 630,
          alt: "Book a table",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Book Your Table",
      description: "Reserve your table now! Quick and easy online booking.",
    },
  };
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
