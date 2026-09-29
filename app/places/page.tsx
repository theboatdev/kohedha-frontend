import Link from "next/link";
import Image from "next/image";
import { getPlaces } from "@/lib/sanity-places";
import StructuredData from "@/components/structured-data";
import { C } from "@/lib/brand-theme";

interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  rating?: number;
  priceRange?: string;
  cuisine?: string[];
  vibe?: string[];
  formattedLocation: string;
  category: string;
  categoryColor?: string;
  status: string;
  featured: boolean;
  isOpen: boolean | null;
  publishedAt?: string;
}

export const metadata = {
  title: "Places & Venues | Kohedha",
  description:
    "Discover amazing restaurants, cafes, and dining venues across Sri Lanka. Find the perfect place for your next meal or coffee break.",
  keywords: [
    "Sri Lanka restaurants",
    "Colombo cafes",
    "Sri Lankan dining",
    "restaurants Sri Lanka",
    "cafes Colombo",
    "food venues",
    "dining places Sri Lanka",
    "best restaurants",
  ],
  openGraph: {
    title: "Places & Venues | Kohedha",
    description:
      "Discover amazing restaurants, cafes, and dining venues across Sri Lanka.",
    type: "website",
    url: "https://kohedha.lk/places",
  },
  twitter: {
    card: "summary_large_image",
    title: "Places & Venues | Kohedha",
    description:
      "Discover amazing restaurants, cafes, and dining venues across Sri Lanka.",
  },
};

export default async function PlacesPage() {
  const allPlaces = await getPlaces();
  const featuredPlaces = allPlaces.filter((place: Place) => place.featured);
  const regularPlaces = allPlaces.filter((place: Place) => !place.featured);

  return (
    <div
      className="font-grotesk"
      style={{
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        fontFamily:
          "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
      }}
    >
      <StructuredData type="website" data={{}} />

      {/* Hero */}
      <section style={{ background: "#0D0D0D", color: "#F6F6F4" }}>
        <div
          className="om-pad"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            paddingTop: "120px",
            paddingBottom: "100px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(246,246,244,0.5)",
            }}
          >
            Discover
          </div>
          <h1
            className="om-hero-h1"
            style={{ margin: "28px 0 0", maxWidth: "14ch", fontSize: "72px" }}
          >
            Places & venues.
          </h1>
          <p
            style={{
              margin: "28px 0 0",
              maxWidth: "48ch",
              fontSize: "17px",
              lineHeight: 1.7,
              fontWeight: 300,
              color: "rgba(246,246,244,0.6)",
            }}
          >
            Discover restaurants, cafes, and dining venues across Sri Lanka —
            filtered by vibe and location.
          </p>
        </div>
      </section>

      <div
        className="om-pad"
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          paddingTop: "80px",
          paddingBottom: "120px",
        }}
      >
        {featuredPlaces.length > 0 && (
          <section style={{ marginBottom: "80px" }}>
            <div
              style={{
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(13,13,13,0.5)",
              }}
            >
              Editor&apos;s picks
            </div>
            <h2 className="om-h2" style={{ margin: "20px 0 0" }}>
              Featured places
            </h2>
            <div
              className="om-3col"
              style={{ gap: "28px", marginTop: "48px" }}
            >
              {featuredPlaces.map((place: Place) => (
                <PlaceCard key={place.id} place={place} featured />
              ))}
            </div>
          </section>
        )}

        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                Browse
              </div>
              <h2 className="om-h2" style={{ margin: "20px 0 0" }}>
                All places
              </h2>
            </div>
            <span
              style={{ fontSize: "14px", color: "rgba(13,13,13,0.5)" }}
            >
              {allPlaces.length} places
            </span>
          </div>

          {allPlaces.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <h3
                style={{
                  fontSize: "26px",
                  letterSpacing: "-0.02em",
                  marginBottom: "12px",
                }}
              >
                No places available yet
              </h3>
              <p
                style={{
                  color: "rgba(13,13,13,0.55)",
                  marginBottom: "28px",
                  fontWeight: 300,
                }}
              >
                Check back soon for amazing restaurants and cafes.
              </p>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "48px",
                  padding: "0 24px",
                  borderRadius: "999px",
                  background: "#F5E642",
                  color: "#0D0D0D",
                  fontSize: "15px",
                  textDecoration: "none",
                }}
              >
                Back to home
              </Link>
            </div>
          ) : (
            <div
              className="om-3col"
              style={{ gap: "28px", marginTop: "48px" }}
            >
              {(regularPlaces.length > 0 ? regularPlaces : allPlaces).map(
                (place: Place) => (
                  <PlaceCard key={place.id} place={place} featured={false} />
                )
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function PlaceCard({
  place,
  featured,
}: {
  place: Place;
  featured: boolean;
}) {
  return (
    <div>
      <div
        style={{
          position: "relative",
          aspectRatio: "4/3",
          background: "rgba(13,13,13,0.055)",
          borderRadius: "16px",
          overflow: "hidden",
          border: featured
            ? "1px solid rgba(13,13,13,0.16)"
            : "1px solid rgba(13,13,13,0.08)",
        }}
      >
        {place.image ? (
          <Image
            src={place.image}
            alt={place.name}
            fill
            className="object-cover"
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: "rgba(13,13,13,0.32)",
            }}
          >
            Venue photo
          </div>
        )}
        <div
          style={{
            position: "absolute",
            left: "16px",
            top: "16px",
            right: "16px",
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
          }}
        >
          {place.category && (
            <span
              style={{
                padding: "6px 12px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.92)",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              {place.category}
            </span>
          )}
          {place.isOpen && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.92)",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "999px",
                  background: "#C8281A",
                }}
              />
              Live
            </span>
          )}
        </div>
      </div>
      <h3
        style={{
          margin: "22px 0 0",
          fontSize: "22px",
          fontWeight: 400,
          letterSpacing: "-0.02em",
        }}
      >
        {place.name}
      </h3>
      <div
        style={{
          marginTop: "7px",
          fontSize: "14px",
          color: "rgba(13,13,13,0.5)",
        }}
      >
        {place.formattedLocation || place.category}
      </div>
      <div
        style={{
          display: "flex",
          gap: "18px",
          marginTop: "20px",
          fontSize: "14px",
        }}
      >
        <Link
          href={`/places/${place.id}`}
          style={{
            borderBottom: "1px solid rgba(13,13,13,0.25)",
            paddingBottom: "2px",
            color: "#0D0D0D",
            textDecoration: "none",
          }}
        >
          View details
        </Link>
        <Link
          href="/events"
          style={{ color: "rgba(13,13,13,0.55)", textDecoration: "none" }}
        >
          Events
        </Link>
        <Link
          href="/deals"
          style={{ color: "rgba(13,13,13,0.55)", textDecoration: "none" }}
        >
          Deals
        </Link>
      </div>
    </div>
  );
}
