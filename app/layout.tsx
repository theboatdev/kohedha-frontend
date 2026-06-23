import type React from "react"
import type { Metadata, Viewport } from "next"
import { League_Spartan, DM_Sans, DM_Serif_Display, Poppins } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import StructuredData from "@/components/structured-data"
import { ConditionalLayout } from "@/components/conditional-layout"
import { Toaster } from "@/components/ui/toaster"

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: "400",
  style: ["normal", "italic"],
})

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: {
    default: "Kohedha - Sri Lanka's Restaurant & Event Discovery App",
    template: "%s | Kohedha"
  },
  description: "Discover the best restaurants and events in Sri Lanka with Kohedha, your ultimate companion for food and entertainment. Find local dining spots, upcoming events, and cultural experiences across the island.",
  keywords: [
    "Sri Lanka restaurants",
    "Colombo dining",
    "Sri Lanka events",
    "food discovery app",
    "restaurant finder Sri Lanka",
    "local events Sri Lanka",
    "Sri Lankan cuisine",
    "restaurant reviews Sri Lanka",
    "event discovery app",
    "food and entertainment Sri Lanka",
    "local dining Sri Lanka",
    "cultural events Sri Lanka",
    "restaurant booking Sri Lanka",
    "foodie app Sri Lanka",
    "event planning Sri Lanka"
  ],
  authors: [{ name: "Kohedha Team" }],
  creator: "Kohedha",
  publisher: "Kohedha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kohedha.lk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kohedha.lk',
    siteName: 'Kohedha',
    title: 'Kohedha - Sri Lanka\'s Restaurant & Event Discovery App',
    description: 'Discover the best restaurants and events in Sri Lanka with Kohedha, your ultimate companion for food and entertainment.',
    images: [
      {
        url: '/KO.png',
        width: 1200,
        height: 630,
        alt: 'Kohedha - Sri Lanka Restaurant & Event Discovery App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kohedha - Sri Lanka\'s Restaurant & Event Discovery App',
    description: 'Discover the best restaurants and events in Sri Lanka with Kohedha, your ultimate companion for food and entertainment.',
    images: ['/KO.png'],
    creator: '@kohedha',
    site: '@kohedha',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'food and entertainment',
  classification: 'restaurant and event discovery platform',
  generator: 'Next.js',
  applicationName: 'Kohedha',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light dark',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Kohedha',
    'application-name': 'Kohedha',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo4.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo4-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo4-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <meta name="google-site-verification" content="D5VEiVoFUnV5W6-SaXTTlML5zP5R82gg7lAtwnKJdd4" />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JQW2DY05FV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JQW2DY05FV');
          `}
        </Script>
      </head>
      <body className={`${leagueSpartan.variable} ${dmSans.variable} ${dmSerifDisplay.variable} ${poppins.variable} font-sans`}>
        <StructuredData type="organization" data={{}} />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Toaster />
      </body>
    </html>
  )
}
