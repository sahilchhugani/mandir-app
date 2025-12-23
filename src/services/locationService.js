// Location Service - Gets user's current location

/**
 * Get user's current position using browser's Geolocation API
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied. Please enable location access.'))
            break
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information unavailable.'))
            break
          case error.TIMEOUT:
            reject(new Error('Location request timed out.'))
            break
          default:
            reject(new Error('An unknown error occurred.'))
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    )
  })
}

/**
 * Calculate distance between two coordinates (in km)
 */
export function getDistanceFromLatLng(lat1, lng1, lat2, lng2) {
  const R = 6371 // Radius of earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLng = deg2rad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

/**
 * Format distance for display
 */
export function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  } else if (km < 10) {
    return `${km.toFixed(1)}km`
  } else {
    return `${Math.round(km)}km`
  }
}

export default {
  getCurrentLocation,
  getDistanceFromLatLng,
  formatDistance,
}

