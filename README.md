# Kohedha Frontend

Next.js web app for the Kohedha platform — Sri Lanka's restaurant and event discovery experience. The public site helps users browse places, events, and deals, make reservations, and join the waitlist. Vendors manage menus, bookings, events, and deals through a web dashboard backed by the Kohedha REST API.

Built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**.

## Features

- **Public discovery** — places, events, deals, and blog content
- **Public booking** — customer reservations via shareable booking links
- **Waitlist** — sign-up flow for early access
- **Vendor dashboard** — registration, login (email/password and Google OAuth), venue profile, menus, floor plan, booking slots, reservations, events, and deals
- **Google Maps** — location picker during vendor registration
- **SEO & PWA** — structured data, sitemap, and web app manifest

## Prerequisites

- Node.js 18+ (20+ recommended)
- npm
- Kohedha [backend](../backend/README.md) running locally for vendor and booking features

## Getting started

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the `frontend` directory:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5002/api

# Google Maps (vendor location picker)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# reCAPTCHA (public booking flow)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
```

See [GOOGLE-MAPS-SETUP.md](./GOOGLE-MAPS-SETUP.md) for Google Maps API setup.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For vendor dashboard and booking flows, start the backend on port **5002** first (see [backend/README.md](../backend/README.md)).

## Project structure

```
frontend/
├── app/
│   ├── page.tsx                    # Home page
│   ├── places/                     # Venue discovery
│   ├── events/                     # Events listing and detail
│   ├── deals/                      # Deals listing and detail
│   ├── blog/                       # Blog listing and posts
│   ├── book/[token]/               # Public customer booking
│   ├── wait-list/                  # Waitlist sign-up
│   └── vendors/                    # Vendor landing and dashboard
├── components/                     # Shared UI and feature components
├── hooks/                          # React hooks
├── lib/                            # API clients and utilities
│   ├── auth.ts                     # Vendor auth
│   ├── venue.ts                    # Venue profile
│   ├── menu.ts                     # Menu management
│   ├── bookingSlots.ts             # Booking slots and reservations
│   ├── events.ts                   # Vendor events API
│   ├── deals.ts                    # Vendor deals API
│   └── publicBooking.ts            # Public booking API
└── public/                         # Static assets, PWA manifest, service worker
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Main routes

| Route | Description |
|-------|-------------|
| `/` | Marketing home page |
| `/places` | Browse venues |
| `/events` | Browse events |
| `/deals` | Browse deals and offers |
| `/blog` | Blog and guides |
| `/book/[token]` | Customer booking via vendor link |
| `/wait-list` | Waitlist sign-up |
| `/vendors` | Vendor landing page |
| `/vendors/login` | Vendor login |
| `/vendors/register` | Vendor registration |
| `/vendors/dashboard` | Vendor dashboard |
| `/vendors/reservation-portal/*` | Booking slots, guest list, floor arrangements |

## Backend integration

The frontend talks to the Kohedha backend via `NEXT_PUBLIC_API_URL`. Vendor routes use JWT auth (httpOnly cookie or Bearer token). Public booking and waitlist endpoints do not require authentication.

Ensure the backend `FRONTEND_URL` matches this app's origin (default `http://localhost:3000`) so CORS and OAuth redirects work correctly.

## Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy to your preferred platform (Vercel is recommended for Next.js).

3. Set all `NEXT_PUBLIC_*` environment variables in your deployment environment.

4. Point `NEXT_PUBLIC_API_URL` at your production backend API.

## Troubleshooting

**API requests failing locally**
- Confirm the backend is running on port 5002 (or update `NEXT_PUBLIC_API_URL`).
- Check that `FRONTEND_URL` in the backend `.env` matches `http://localhost:3000`.

**Vendor login or Google OAuth not working**
- Verify `NEXT_PUBLIC_API_URL` is set and reachable from the browser.
- Confirm Google OAuth credentials and callback URLs are configured in the backend.

**Google Maps not loading on vendor registration**
- Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set and the required Google Cloud APIs are enabled (see [GOOGLE-MAPS-SETUP.md](./GOOGLE-MAPS-SETUP.md)).

**Environment variables not applied**
- Variables must be prefixed with `NEXT_PUBLIC_` to be available in the browser.
- Restart the dev server after changing `.env.local`.

## License

This project is licensed under the MIT License.
