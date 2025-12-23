import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, SlidersHorizontal, X, MapPin, Navigation } from 'lucide-react'
import TempleCard from '../components/TempleCard'
import { categories, states } from '../data/temples'
import { formatDistance } from '../services/locationService'

function Explore({ temples, toggleWishlist, userLocation }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedState, setSelectedState] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('friends')

  // Read category from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  const nearbyTemples = userLocation 
    ? temples.filter(t => t.distance !== null && t.distance < 200).slice(0, 5)
    : []

  const filteredTemples = useMemo(() => {
    let result = [...temples]
    
    // Category filter
    if (selectedCategory) {
      const category = categories.find(c => c.name === selectedCategory)
      if (category && category.filter) {
        result = result.filter(category.filter)
      }
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.location.toLowerCase().includes(query) ||
        t.deity?.toLowerCase().includes(query) ||
        t.hindiName?.toLowerCase().includes(query)
      )
    }
    
    // State filter
    if (selectedState) {
      result = result.filter(t => t.state === selectedState)
    }
    
    // Sort
    if (sortBy === 'friends') {
      result.sort((a, b) => (b.friendRatings?.length || 0) - (a.friendRatings?.length || 0))
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'distance' && userLocation) {
      result.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
    }
    
    return result
  }, [temples, searchQuery, selectedState, selectedCategory, sortBy, userLocation])

  const clearFilters = () => {
    setSelectedState('')
    setSelectedCategory('')
    setSortBy('friends')
    setSearchParams({})
  }

  const hasActiveFilters = selectedState || selectedCategory || sortBy !== 'friends'

  return (
    <div style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: '6rem', minHeight: '100vh', background: '#342920' }}>
      {/* Header */}
      <header style={{
        padding: '1rem 1.5rem 0.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'linear-gradient(to bottom, #342920, #342920 90%, transparent)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 300, color: 'white' }}>
            {selectedCategory || 'Explore'}
          </h1>
          {selectedCategory && (
            <button
              onClick={() => { setSelectedCategory(''); setSearchParams({}); }}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
        
        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            flex: 1,
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <Search size={20} color="rgba(255, 255, 255, 0.4)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search temples, cities, deities..."
              style={{
                flex: 1,
                background: 'transparent',
                color: 'white',
                border: 'none',
                outline: 'none',
                fontSize: '14px'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={16} color="rgba(255, 255, 255, 0.4)" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '0 1rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: hasActiveFilters ? 'rgba(239, 192, 31, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: hasActiveFilters ? '1px solid rgba(239, 192, 31, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <SlidersHorizontal size={20} color={hasActiveFilters ? '#efc01f' : 'rgba(255, 255, 255, 0.6)'} />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ color: 'white', fontWeight: 400 }}>Filters</h3>
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters} 
                  style={{ color: '#efc01f', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Clear all
                </button>
              )}
            </div>
            
            {/* State Filter */}
            <div style={{ marginTop: '1rem' }}>
              <label style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{
                  marginTop: '0.5rem',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.75rem',
                  padding: '0.625rem 1rem',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div style={{ marginTop: '1rem' }}>
              <label style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Sort By
              </label>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                {[
                  { value: 'friends', label: 'Most Rated' },
                  { value: 'name', label: 'A-Z' },
                  ...(userLocation ? [{ value: 'distance', label: 'Nearest' }] : [])
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: 'none',
                      background: sortBy === option.value ? '#efc01f' : 'rgba(255, 255, 255, 0.05)',
                      color: sortBy === option.value ? 'black' : 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Near You Section */}
      {nearbyTemples.length > 0 && !selectedCategory && !searchQuery && (
        <section style={{ padding: '0 1.5rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Navigation size={16} color="#10b981" />
            <h2 style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Near You
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {nearbyTemples.map((temple) => (
              <Link
                key={temple.id}
                to={`/temple/${temple.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  textDecoration: 'none',
                }}
              >
                {temple.image ? (
                  <img
                    src={temple.image}
                    alt={temple.name}
                    style={{ 
                      width: '52px', 
                      height: '52px', 
                      borderRadius: '10px', 
                      objectFit: 'cover',
                    }}
                    onError={(e) => { 
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{ 
                    width: '52px', 
                    height: '52px', 
                    borderRadius: '10px', 
                    background: 'rgba(212, 175, 87, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>🛕</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ color: 'white', fontSize: '15px', fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {temple.name}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px', marginTop: '3px', fontWeight: 300 }}>
                    {temple.location?.split(',')[0]}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  flexShrink: 0,
                }}>
                  <MapPin size={12} color="#10b981" strokeWidth={1.5} />
                  <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 500 }}>
                    {formatDistance(temple.distance)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Temples */}
      <div style={{ padding: '0 1.5rem' }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px', marginBottom: '1rem' }}>
          {filteredTemples.length} temple{filteredTemples.length !== 1 ? 's' : ''} found
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '2rem' }}>
          {filteredTemples.map((temple) => (
            <TempleCard 
              key={temple.id} 
              temple={temple} 
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
        
        {filteredTemples.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕉️</div>
            <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No temples found</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Explore
