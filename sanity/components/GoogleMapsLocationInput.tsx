import React, { useState, useCallback, useEffect, useRef } from 'react'
import { set, unset } from 'sanity'
import { Stack, Card, Text, Button, TextInput, Box, Inline } from '@sanity/ui'
import { PinIcon, SearchIcon, MapIcon } from '@sanity/icons'
import type { ObjectInputProps } from 'sanity'

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

interface LocationData {
  name?: string
  address?: string
  city?: string
  district?: string
  postalCode?: string
  country?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export const GoogleMapsLocationInput = (props: ObjectInputProps) => {
  const { value, onChange } = props
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showMap, setShowMap] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  // Initialize value if it doesn't exist
  const locationData = value || {
    name: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    country: 'Sri Lanka',
    coordinates: { lat: 0, lng: 0 }
  }

  const handleLocationUpdate = useCallback((updates: any) => {
    const newValue = { ...locationData, ...updates }
    onChange(set(newValue))
  }, [locationData, onChange])

  // Load Google Maps API
  useEffect(() => {
    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        setMapLoaded(true)
        if (showMap) {
          initializeMap()
        }
      }
      document.head.appendChild(script)
    } else if (window.google) {
      setMapLoaded(true)
    }
  }, [])

  // Initialize map when component mounts or showMap changes
  useEffect(() => {
    if (mapLoaded && showMap && mapRef.current && !mapInstanceRef.current) {
      initializeMap()
    }
  }, [mapLoaded, showMap])

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    const defaultLocation = locationData.coordinates && locationData.coordinates.lat !== 0 
      ? { lat: locationData.coordinates.lat, lng: locationData.coordinates.lng }
      : { lat: 6.9271, lng: 79.8612 } // Default to Colombo, Sri Lanka

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    mapInstanceRef.current = map

    // Add marker if coordinates exist
    if (locationData.coordinates && locationData.coordinates.lat !== 0) {
      addMarker(locationData.coordinates.lat, locationData.coordinates.lng)
    }

    // Add click listener to map
    map.addListener('click', (event: any) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      handleMapClick(lat, lng)
    })
  }

  const addMarker = (lat: number, lng: number) => {
    if (markerRef.current) {
      markerRef.current.setMap(null)
    }

    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      draggable: true,
      title: 'Selected Location'
    })

    markerRef.current = marker

    // Add drag listener
    marker.addListener('dragend', (event: any) => {
      const newLat = event.latLng.lat()
      const newLng = event.latLng.lng()
      handleMapClick(newLat, newLng)
    })
  }

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      // Reverse geocoding to get address details
      const geocoder = new window.google.maps.Geocoder()
      const response = await geocoder.geocode({ location: { lat, lng } })
      
      if (response.results[0]) {
        const result = response.results[0]
        const addressComponents = result.address_components
        
        // Parse address components
        const name = result.name !== result.formatted_address ? result.name : ''
        const address = result.formatted_address
        const city = getAddressComponent(addressComponents, 'locality') || 
                    getAddressComponent(addressComponents, 'administrative_area_level_1')
        const district = getAddressComponent(addressComponents, 'administrative_area_level_2')
        const postalCode = getAddressComponent(addressComponents, 'postal_code')
        const country = getAddressComponent(addressComponents, 'country')

        handleLocationUpdate({
          name,
          address,
          city,
          district,
          postalCode,
          country,
          coordinates: { lat, lng }
        })

        addMarker(lat, lng)
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error)
      // Still update coordinates even if reverse geocoding fails
      handleLocationUpdate({
        coordinates: { lat, lng }
      })
      addMarker(lat, lng)
    }
  }

  const getAddressComponent = (components: any[], type: string) => {
    const component = components.find(comp => comp.types.includes(type))
    return component ? component.long_name : ''
  }

  const searchLocation = async () => {
    if (!searchQuery.trim() || !window.google) return
    
    setIsSearching(true)
    try {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      )
      
      const request = {
        query: `${searchQuery}, Sri Lanka`,
        fields: ['name', 'formatted_address', 'geometry', 'address_components']
      }

      service.textSearch(request, (results: any[], status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSearchResults(results.slice(0, 5))
        } else {
          setSearchResults([])
        }
        setIsSearching(false)
      })
    } catch (error) {
      console.error('Error searching location:', error)
      setSearchResults([])
      setIsSearching(false)
    }
  }

  const selectLocation = (result: any) => {
    const lat = result.geometry.location.lat()
    const lng = result.geometry.location.lng()
    
    // Parse address components
    const name = result.name
    const address = result.formatted_address
    const addressComponents = result.address_components || []
    
    const city = getAddressComponent(addressComponents, 'locality') || 
                getAddressComponent(addressComponents, 'administrative_area_level_1')
    const district = getAddressComponent(addressComponents, 'administrative_area_level_2')
    const postalCode = getAddressComponent(addressComponents, 'postal_code')
    const country = getAddressComponent(addressComponents, 'country')

    handleLocationUpdate({
      name,
      address,
      city,
      district,
      postalCode,
      country,
      coordinates: { lat, lng }
    })

    setSearchQuery('')
    setSearchResults([])
    
    // Update map if it's visible
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat, lng })
      addMarker(lat, lng)
    }
  }

  const clearLocation = () => {
    onChange(unset())
    if (markerRef.current) {
      markerRef.current.setMap(null)
      markerRef.current = null
    }
  }

  const toggleMap = () => {
    setShowMap(!showMap)
    if (!showMap && mapLoaded && !mapInstanceRef.current) {
      setTimeout(initializeMap, 100)
    }
  }

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} shadow={1}>
        <Stack space={3}>
          <Inline space={2} align="center">
            <MapIcon />
            <Text size={2} weight="semibold">
              Location Information
            </Text>
          </Inline>
          
          {/* Search Section */}
          <Stack space={2}>
            <Box style={{ display: 'flex', gap: '8px' }}>
              <TextInput
                placeholder="Search for a location..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                icon={SearchIcon}
                onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
              />
              <Button
                mode="default"
                onClick={searchLocation}
                disabled={isSearching || !searchQuery.trim() || !mapLoaded}
                text={isSearching ? 'Searching...' : 'Search'}
              />
            </Box>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card padding={2} radius={1} shadow={1}>
                <Stack space={2}>
                  <Text size={1} weight="semibold">Search Results:</Text>
                  {searchResults.map((result, index) => (
                    <Card
                      key={index}
                      padding={2}
                      radius={1}
                      shadow={1}
                      style={{ cursor: 'pointer' }}
                      onClick={() => selectLocation(result)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Stack space={1}>
                        <Text size={1} weight="semibold">{result.name}</Text>
                        <Text size={0} style={{ color: '#666' }}>{result.formatted_address}</Text>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Card>
            )}
          </Stack>

          {/* Manual Input Fields */}
          <Stack space={2}>
            <TextInput
              placeholder="Venue/Business Name"
              value={locationData.name || ''}
              onChange={(event) => handleLocationUpdate({ name: event.currentTarget.value })}
            />
            
            <TextInput
              placeholder="Street Address"
              value={locationData.address || ''}
              onChange={(event) => handleLocationUpdate({ address: event.currentTarget.value })}
            />
            
            <Box style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr' }}>
              <TextInput
                placeholder="City"
                value={locationData.city || ''}
                onChange={(event) => handleLocationUpdate({ city: event.currentTarget.value })}
              />
              
              <TextInput
                placeholder="District"
                value={locationData.district || ''}
                onChange={(event) => handleLocationUpdate({ district: event.currentTarget.value })}
              />
            </Box>
            
            <Box style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr' }}>
              <TextInput
                placeholder="Postal Code"
                value={locationData.postalCode || ''}
                onChange={(event) => handleLocationUpdate({ postalCode: event.currentTarget.value })}
              />
              
              <TextInput
                placeholder="Country"
                value={locationData.country || ''}
                onChange={(event) => handleLocationUpdate({ country: event.currentTarget.value })}
              />
            </Box>
          </Stack>

          {/* Coordinates Display */}
          {locationData.coordinates && (locationData.coordinates.lat !== 0 || locationData.coordinates.lng !== 0) && (
            <Card padding={2} radius={1} shadow={1} tone="positive">
              <Stack space={1}>
                <Text size={1} weight="semibold">Coordinates:</Text>
                <Text size={1}>
                  Lat: {locationData.coordinates.lat.toFixed(6)}, 
                  Lng: {locationData.coordinates.lng.toFixed(6)}
                </Text>
              </Stack>
            </Card>
          )}

          {/* Action Buttons */}
          <Box style={{ display: 'flex', gap: '8px' }}>
            <Button
              mode="ghost"
              icon={MapIcon}
              onClick={toggleMap}
              text={showMap ? 'Hide Map' : 'Show Map'}
            />
            <Button
              mode="ghost"
              icon={PinIcon}
              text="Location Set!"
              disabled
            />
            <Button
              mode="ghost"
              tone="critical"
              onClick={clearLocation}
              text="Clear Location"
            />
          </Box>
        </Stack>
      </Card>

      {/* Google Maps Display */}
      {showMap && (
        <Card padding={3} radius={2} shadow={1}>
          <Stack space={2}>
            <Text size={2} weight="semibold">Interactive Map</Text>
            <Text size={1} style={{ color: '#666' }}>
              Click on the map to set location or drag the marker to adjust
            </Text>
            <Card 
              padding={2} 
              radius={1} 
              shadow={1} 
              style={{ height: '400px', backgroundColor: '#f5f5f5' }}
            >
              <div 
                ref={mapRef} 
                style={{ width: '100%', height: '100%', borderRadius: '4px' }}
              />
            </Card>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
