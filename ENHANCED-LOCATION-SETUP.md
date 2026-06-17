# Enhanced Location Setup Guide

## Overview
This guide covers the complete setup for enhanced location functionality in Sanity Studio, including both basic location fields and Google Maps integration.

## Available Location Types

### 1. Basic Location Type (`location`)
- Simple location fields without map integration
- Manual coordinate entry
- Basic address fields

### 2. Enhanced Google Maps Location Type (`googleMapsLocation`)
- Interactive Google Maps integration
- Automatic coordinate extraction
- Address parsing and validation
- Place search functionality

## Setup Instructions

### Step 1: Environment Configuration
Create a `.env.local` file in your project root:

```bash
# Google Maps API Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Step 2: Google Cloud Platform Setup
1. **Create Project**: Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable Billing**: Required for API usage
3. **Enable APIs**:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. **Create API Key**: With appropriate restrictions

### Step 3: Schema Configuration
The schemas are already configured to use the enhanced location types:

#### Deal Schema
```typescript
defineField({
  name: 'location',
  title: 'Location',
  type: 'googleMapsLocation',
  description: 'Enhanced location information with Google Maps integration'
})
```

#### Event Schema
```typescript
defineField({
  name: 'location',
  title: 'Location',
  type: 'googleMapsLocation',
  description: 'Enhanced location information with Google Maps integration'
})
```

## Features

### 🗺️ Interactive Map
- **Click to Set**: Click anywhere on the map to set location
- **Drag & Drop**: Drag marker for precise positioning
- **Default Center**: Automatically centers on Colombo, Sri Lanka
- **Zoom Control**: Adjustable zoom levels for detail

### 🔍 Location Search
- **Google Places Search**: Search for places, landmarks, addresses
- **Automatic Coordinates**: GPS coordinates extracted automatically
- **Address Parsing**: City, district, postal code auto-populated
- **Sri Lanka Focus**: Optimized for local locations

### 📍 Reverse Geocoding
- **Click to Address**: Click map to get full address details
- **Component Extraction**: Automatic parsing of address components
- **Validation**: Ensures data accuracy and consistency

### 🎯 Enhanced Data Fields
- **Google Place ID**: Unique identifier for location tracking
- **Formatted Address**: Google-standardized address format
- **Last Updated**: Timestamp for data freshness tracking

## Usage Guide

### For Content Editors

#### 1. Adding a New Location
1. **Search Method**:
   - Type location name in search field
   - Select from search results
   - All fields auto-populate

2. **Map Method**:
   - Click "Show Map" button
   - Click desired location on map
   - Address details auto-populate

3. **Manual Method**:
   - Fill in fields manually
   - Use map to set coordinates

#### 2. Editing Existing Location
1. **Update Coordinates**:
   - Show map
   - Drag marker to new position
   - Address updates automatically

2. **Modify Details**:
   - Edit any field manually
   - Use search to refresh data
   - Validate with map preview

### For Developers

#### 1. Data Structure
```typescript
interface GoogleMapsLocation {
  name: string
  address: string
  city: string
  district?: string
  postalCode?: string
  country: string
  coordinates: {
    lat: number
    lng: number
  }
  mapData: {
    placeId: string
    formattedAddress: string
    lastUpdated: string
  }
}
```

#### 2. API Integration
```typescript
// Example: Using location data in your app
const location = deal.location
const { lat, lng } = location.coordinates
const address = location.mapData.formattedAddress

// Google Maps integration
const map = new google.maps.Map(element, {
  center: { lat, lng },
  zoom: 15
})

new google.maps.Marker({
  position: { lat, lng },
  map: map,
  title: location.name
})
```

## Cost Analysis

### Google Maps API Costs
- **Maps JavaScript API**: $7 per 1,000 map loads
- **Places API**: $17 per 1,000 requests
- **Geocoding API**: $5 per 1,000 requests

### Typical Monthly Usage (100 locations)
- Map loads: ~$0.70
- Location searches: ~$1.70
- Geocoding: ~$0.50
- **Total**: ~$2.90/month

### Cost Optimization
- Cache location data
- Limit map loads in previews
- Use basic location type for simple cases

## Migration Guide

### From Basic to Enhanced
1. **Update Schema**: Change `type: 'location'` to `type: 'googleMapsLocation'`
2. **Data Migration**: Existing data will be preserved
3. **Field Mapping**: All basic fields are compatible
4. **New Features**: Enhanced fields will be empty initially

### Backward Compatibility
- Basic location fields remain accessible
- Enhanced fields are optional
- Gradual migration supported

## Troubleshooting

### Common Issues

#### 1. Map Not Loading
- Check API key configuration
- Verify API restrictions
- Check browser console for errors

#### 2. Search Not Working
- Ensure Places API is enabled
- Check API key permissions
- Verify billing is enabled

#### 3. Coordinates Not Updating
- Check map click events
- Verify geocoding API access
- Check network connectivity

### Debug Steps
1. **Check Environment**: Verify `.env.local` file
2. **API Status**: Check Google Cloud Console
3. **Browser Console**: Look for JavaScript errors
4. **Network Tab**: Verify API requests

## Best Practices

### Content Management
1. **Use Search First**: Leverage Google Places for accuracy
2. **Validate with Map**: Always verify coordinates visually
3. **Keep Data Fresh**: Regular updates ensure accuracy
4. **Use Place IDs**: For consistent location tracking

### Development
1. **Error Handling**: Implement fallbacks for API failures
2. **Rate Limiting**: Respect API quotas and limits
3. **Caching**: Store location data locally when possible
4. **Monitoring**: Track API usage and costs

### Security
1. **API Key Restrictions**: Limit to specific domains
2. **HTTPS Only**: Secure API communication
3. **Input Validation**: Sanitize user inputs
4. **Access Control**: Limit who can edit locations

## Support and Resources

### Documentation
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding)

### Community
- [Google Maps Platform Community](https://developers.google.com/maps/support)
- [Sanity Community](https://www.sanity.io/community)

### Development Team
For component-specific issues or customizations, contact the development team.

## Next Steps

### Future Enhancements
1. **Location Clustering**: Group nearby locations
2. **Route Planning**: Calculate distances and routes
3. **Real-time Updates**: Live location tracking
4. **Analytics Dashboard**: Usage insights and optimization

### Integration Opportunities
1. **Mobile Apps**: Native map integration
2. **E-commerce**: Store locator functionality
3. **Event Management**: Venue discovery
4. **Tourism**: Points of interest mapping

---

**Note**: This enhanced location system provides a professional-grade solution for location management in Sanity Studio. The Google Maps integration ensures accuracy and provides an excellent user experience for content editors.
