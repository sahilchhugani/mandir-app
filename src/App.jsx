import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Explore from './pages/Explore'
import TempleDetail from './pages/TempleDetail'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import Navigation from './components/Navigation'
import { searchTemples } from './services/placesApi'
import { getCurrentLocation, getDistanceFromLatLng } from './services/locationService'

// Generate mock friend ratings for demo
function generateMockFriendRatings(templeIndex) {
  const friends = [
    { name: 'Priya', avatar: '👩' },
    { name: 'Rahul', avatar: '👨' },
    { name: 'Amit', avatar: '👨‍🦱' },
  ]
  
  const notes = [
    'Absolutely magical experience! Go during sunrise for fewer crowds.',
    'The spiritual atmosphere is incredible. Must visit at least once.',
    'Beautiful architecture and very peaceful. Highly recommend.',
    'Great experience overall. The prasad was delicious!',
  ]
  
  const count = templeIndex === 0 ? 2 : templeIndex === 3 ? 2 : 1
  
  return friends.slice(0, count).map((friend, i) => ({
    oderId: `user${i + 1}`,
    friendName: friend.name,
    friendAvatar: friend.avatar,
    date: new Date(Date.now() - (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ratings: {
      spiritual: 4 + Math.round(Math.random()),
      cleanliness: 3 + Math.round(Math.random() * 2),
      accessibility: 2 + Math.round(Math.random() * 3),
      crowdLevels: ['Calm', 'Moderate', 'Packed'][Math.floor(Math.random() * 3)],
      rituals: 4 + Math.round(Math.random()),
      hospitality: 3 + Math.round(Math.random() * 2),
      culturalValue: 5,
    },
    note: notes[(templeIndex + i) % notes.length],
  }))
}

function App() {
  const [temples, setTemples] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)

  // Load temples and get location in parallel
  useEffect(() => {
    const init = async () => {
      console.log('🚀 App initializing...')
      
      // Start fetching temples immediately with no location
      try {
        const data = await searchTemples('', null)
        console.log('✅ Got temples:', data.length)
        
        // Add some default visited/wishlisted for demo
        const templesWithState = data.map((t, i) => ({
          ...t,
          isVisited: [0, 3, 6].includes(i),
          isWishlisted: [1, 3, 5].includes(i),
          friendRatings: i < 4 ? generateMockFriendRatings(i) : [],
        }))
        
        setTemples(templesWithState)
      } catch (err) {
        console.error('Failed to fetch temples:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
      
      // Try to get location in background (non-blocking)
      try {
        const location = await getCurrentLocation()
        console.log('📍 Got location:', location)
        setUserLocation(location)
      } catch (err) {
        console.log('📍 Location error (not critical):', err.message)
        setLocationError(err.message)
      }
    }
    
    init()
  }, [])

  // Add distance to temples when we have user location
  const templesWithDistance = userLocation
    ? temples.map(t => ({
        ...t,
        distance: t.coordinates 
          ? getDistanceFromLatLng(
              userLocation.lat, 
              userLocation.lng, 
              t.coordinates.lat, 
              t.coordinates.lng
            )
          : null
      })).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
    : temples

  const toggleWishlist = (templeId) => {
    setTemples(prev => prev.map(t => 
      t.id === templeId ? { ...t, isWishlisted: !t.isWishlisted } : t
    ))
  }

  const toggleVisited = (templeId) => {
    setTemples(prev => prev.map(t => 
      t.id === templeId ? { ...t, isVisited: !t.isVisited } : t
    ))
  }

  const addRating = (templeId, rating) => {
    setTemples(prev => prev.map(t => {
      if (t.id !== templeId) return t
      
      const existingRatings = t.friendRatings || []
      const userRatingIndex = existingRatings.findIndex(r => r.friendName === 'You')
      
      let newRatings
      if (userRatingIndex >= 0) {
        newRatings = [...existingRatings]
        newRatings[userRatingIndex] = rating
      } else {
        newRatings = [rating, ...existingRatings]
      }
      
      return { ...t, friendRatings: newRatings }
    }))
  }

  // Loading screen
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#342920',
        color: '#d4af57',
      }}>
        {/* Temple Icon */}
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L12 4M12 4C9 4 7 6 7 8L7 10L17 10L17 8C17 6 15 4 12 4Z" stroke="#d4af57" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M5 10L5 20L19 20L19 10" stroke="#d4af57" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M8 10L8 20M16 10L16 20" stroke="#d4af57" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M10 20L10 15L14 15L14 20" stroke="#d4af57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="2" r="1" fill="#d4af57"/>
        </svg>
        
        {/* App name */}
        <h1 style={{ 
          color: '#d4af57', 
          fontSize: '1.5rem', 
          fontWeight: 300,
          marginTop: '1.5rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          Mandir
        </h1>
        
        {/* Loading text */}
        <p style={{ 
          color: 'rgba(255,255,255,0.4)', 
          fontSize: '0.875rem', 
          marginTop: '1rem',
        }}>
          Loading...
        </p>
      </div>
    )
  }

  // Error screen
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        background: '#2a201a',
      }}>
        <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</span>
        <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Failed to load temples</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '1.5rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            background: '#efc01f',
            color: 'black',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
      <Routes>
        <Route path="/" element={
          <Home 
            temples={templesWithDistance} 
            toggleWishlist={toggleWishlist}
            userLocation={userLocation}
          />
        } />
        <Route path="/explore" element={
          <Explore 
            temples={templesWithDistance} 
            toggleWishlist={toggleWishlist}
            userLocation={userLocation}
          />
        } />
        <Route path="/temple/:id" element={
          <TempleDetail 
            temples={templesWithDistance} 
            toggleWishlist={toggleWishlist} 
            toggleVisited={toggleVisited}
            addRating={addRating}
            userLocation={userLocation}
          />
        } />
        <Route path="/wishlist" element={<Wishlist temples={templesWithDistance} toggleWishlist={toggleWishlist} />} />
        <Route path="/profile" element={<Profile temples={templesWithDistance} />} />
      </Routes>
      <Navigation />
    </div>
  )
}

export default App
