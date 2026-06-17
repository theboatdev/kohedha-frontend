# Google Maps API Setup Guide

## Overview
This guide explains how to set up Google Maps API integration. The same API key powers two features:

1. **Vendor Registration (Step 3)** — an interactive map picker that lets vendors select their business location by searching, clicking, or using browser geolocation. Latitude and longitude are extracted automatically and stored with the vendor profile.
2. **Sanity Studio** — the `GoogleMapsLocationInput` component used when editing venue/location content.

## Prerequisites
- Google Cloud Platform account
- Billing enabled on your Google Cloud project

## Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for the project

## Step 2: Enable Required APIs
Enable the following APIs in your Google Cloud project:

### Required APIs:
- **Maps JavaScript API** - For displaying interactive maps
- **Places API** - For location search functionality
- **Geocoding API** - For reverse geocoding (coordinates to address)

### How to Enable:
1. Go to "APIs & Services" > "Library"
2. Search for each API name
3. Click on the API and press "Enable"

## Step 3: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

## Step 4: Restrict API Key (Recommended)
For security, restrict your API key:

1. Click on the created API key
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domain (e.g., `localhost:3000/*` for development)
3. Under "API restrictions":
   - Select "Restrict key"
   - Select only the three APIs mentioned above

## Step 5: Environment Configuration
Create a `.env.local` file in your project root:

```bash
# Google Maps API Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## Step 6: Verify Integration Points
Both integrations load the Maps JS API using the same environment variable. No additional configuration is needed:

- **Vendor Registration** — `kohedha-public/components/vendors/location-map-selector.tsx` loads the script via `kohedha-public/lib/google-maps/use-google-maps.ts`.
- **Sanity Studio** — `kohedha-public/sanity/components/GoogleMapsLocationInput.tsx` uses the same key directly.

## Features Enabled

### 1. Interactive Map
- Click anywhere on the map to set location
- Drag and drop marker for precise positioning
- Default center on Colombo, Sri Lanka

### 2. Location Search
- Search for places, landmarks, and addresses
- Automatic coordinate extraction
- Address component parsing

### 3. Reverse Geocoding
- Click on map to get full address details
- Automatic population of all location fields
- Accurate city, district, and postal code extraction

### 4. Enhanced UX
- Real-time map updates
- Visual feedback with markers
- Responsive design for all screen sizes

## Cost Considerations
- **Maps JavaScript API**: $7 per 1,000 map loads
- **Places API**: $17 per 1,000 requests
- **Geocoding API**: $5 per 1,000 requests

For typical usage, costs are minimal:
- 100 map loads per month: ~$0.70
- 100 location searches per month: ~$1.70
- 100 geocoding requests per month: ~$0.50

## Troubleshooting

### Common Issues:
1. **"Google Maps API error"**: Check if API key is correct and APIs are enabled
2. **"Places API not enabled"**: Enable Places API in Google Cloud Console
3. **"Billing not enabled"**: Enable billing for your Google Cloud project
4. **Map not loading**: Check browser console for JavaScript errors

### Development vs Production:
- **Development**: Use `localhost:3000/*` in API key restrictions
- **Production**: Add your production domain to API key restrictions

## Security Best Practices
1. **Never commit API keys** to version control
2. **Use environment variables** for API keys
3. **Restrict API keys** to specific domains and APIs
4. **Monitor usage** in Google Cloud Console
5. **Set up billing alerts** to avoid unexpected charges

## Support
If you encounter issues:
1. Check Google Cloud Console for API quotas and errors
2. Verify API key restrictions and enabled APIs
3. Check browser console for JavaScript errors
4. Contact the development team for component-specific issues
