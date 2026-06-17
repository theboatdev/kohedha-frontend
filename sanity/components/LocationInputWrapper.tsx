import React from 'react'
import { GoogleMapsLocationInput } from './GoogleMapsLocationInput'
import type { ObjectInputProps } from 'sanity'

export const LocationInputWrapper = (props: ObjectInputProps) => {
  return <GoogleMapsLocationInput {...props} />
}
