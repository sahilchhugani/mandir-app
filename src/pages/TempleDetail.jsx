import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Heart, Share2, MapPin, Clock, Calendar, 
  Shirt, CheckCircle2, Navigation, ExternalLink, Users, Star, Edit3
} from 'lucide-react'
import { ratingCategories } from '../data/temples'
import RatingModal from '../components/RatingModal'

function TempleDetail({ temples, toggleWishlist, toggleVisited, addRating }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const temple = temples.find(t => t.id === parseInt(id))
  const [showRatingModal, setShowRatingModal] = useState(false)

  if (!temple) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Temple not found</p>
      </div>
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: temple.name,
          text: `Check out ${temple.name} on Mandir`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
  }

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${temple.coordinates.lat},${temple.coordinates.lng}`
    window.open(url, '_blank')
  }

  const handleRatingSubmit = (rating) => {
    if (addRating) {
      addRating(temple.id, rating)
    }
  }

  // Check if current user has already rated
  const userRating = temple.friendRatings?.find(r => r.friendName === 'You')

  // Calculate average friend rating for a category
  const getAverageRating = (categoryId) => {
    if (!temple.friendRatings || temple.friendRatings.length === 0) return null
    const ratings = temple.friendRatings
      .map(fr => fr.ratings[categoryId])
      .filter(r => typeof r === 'number')
    if (ratings.length === 0) return null
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
  }

  // Get most common crowd level
  const getMostCommonCrowdLevel = () => {
    if (!temple.friendRatings || temple.friendRatings.length === 0) return null
    const levels = temple.friendRatings.map(fr => fr.ratings.crowdLevels).filter(Boolean)
    if (levels.length === 0) return null
    const counts = levels.reduce((acc, level) => {
      acc[level] = (acc[level] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  }

  const friendCount = temple.friendRatings?.length || 0
  const overallAverage = friendCount > 0 
    ? (ratingCategories
        .filter(c => c.id !== 'crowdLevels')
        .map(c => parseFloat(getAverageRating(c.id)) || 0)
        .reduce((a, b) => a + b, 0) / 6).toFixed(1)
    : null

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative" style={{ height: '45vh', minHeight: '320px' }}>
        <img
          src={temple.image}
          alt={temple.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #342920, rgba(52,41,32,0.4) 50%, transparent)'
        }} />
        
        {/* Header Actions */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '0.75rem',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={22} color="white" />
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleShare}
              style={{
                padding: '0.75rem',
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Share2 size={20} color="white" />
            </button>
            <button
              onClick={() => toggleWishlist(temple.id)}
              style={{
                padding: '0.75rem',
                borderRadius: '9999px',
                background: temple.isWishlisted ? '#e4724e' : 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Heart 
                size={20} 
                color="white"
                fill={temple.isWishlisted ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem' }}>
          {temple.isVisited && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.9)',
              marginBottom: '0.75rem'
            }}>
              <CheckCircle2 size={14} color="white" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>VISITED</span>
            </div>
          )}
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
            {temple.name}
          </h1>
          {temple.hindiName && (
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.125rem', marginTop: '0.25rem' }}>
              {temple.hindiName}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <MapPin size={16} color="#efc01f" />
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{temple.location}</span>
            </div>
            {friendCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Users size={16} color="#efc01f" />
                <span style={{ color: 'white', fontWeight: 500, fontSize: '14px' }}>
                  {friendCount} rating{friendCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem', paddingBottom: '6rem' }}>
        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => toggleVisited(temple.id)}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '1rem',
              fontWeight: 600,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: temple.isVisited ? '#10b981' : '#efc01f',
              color: temple.isVisited ? 'white' : 'black'
            }}
          >
            <CheckCircle2 size={18} />
            {temple.isVisited ? 'Visited' : 'Mark as Visited'}
          </button>
          <button
            onClick={openMaps}
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Navigation size={18} color="#efc01f" />
            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>Directions</span>
          </button>
        </div>

        {/* Rate This Temple Button */}
        <button
          onClick={() => setShowRatingModal(true)}
          style={{
            width: '100%',
            marginTop: '0.75rem',
            padding: '1rem',
            borderRadius: '1rem',
            fontWeight: 600,
            fontSize: '14px',
            border: userRating ? '1px solid rgba(239, 192, 31, 0.3)' : '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: userRating ? 'rgba(239, 192, 31, 0.1)' : 'rgba(255,255,255,0.05)',
            color: userRating ? '#efc01f' : 'white'
          }}
        >
          {userRating ? <Edit3 size={18} /> : <Star size={18} />}
          {userRating ? 'Edit Your Rating' : 'Rate This Temple'}
        </button>

        {/* Description */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          borderRadius: '1.5rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h2 style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.75rem' }}>About</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6 }}>{temple.description}</p>
        </div>

        {/* Friend Ratings Section */}
        {friendCount > 0 && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            borderRadius: '1.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem' }}>
                Ratings
              </h2>
              {overallAverage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#efc01f', fontSize: '1.5rem', fontWeight: 700 }}>{overallAverage}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>avg</span>
                </div>
              )}
            </div>
            
            {/* Category Ratings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ratingCategories.map(category => {
                const avgRating = category.id === 'crowdLevels' 
                  ? getMostCommonCrowdLevel()
                  : getAverageRating(category.id)
                
                if (!avgRating) return null
                
                return (
                  <div 
                    key={category.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      borderRadius: '0.75rem',
                      background: 'rgba(255,255,255,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{category.icon}</span>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{category.name}</span>
                    </div>
                    {category.id === 'crowdLevels' ? (
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: avgRating === 'Calm' ? 'rgba(16, 185, 129, 0.2)' 
                          : avgRating === 'Moderate' ? 'rgba(239, 192, 31, 0.2)' 
                          : 'rgba(239, 68, 68, 0.2)',
                        color: avgRating === 'Calm' ? '#10b981' 
                          : avgRating === 'Moderate' ? '#efc01f' 
                          : '#ef4444'
                      }}>
                        {avgRating}
                      </span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ color: '#efc01f', fontWeight: 600 }}>{avgRating}</span>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>/5</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Individual Friend Reviews */}
        {friendCount > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h2 style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem', marginBottom: '1rem' }}>
              What People Said
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {temple.friendRatings.map((review, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    background: review.friendName === 'You' 
                      ? 'rgba(239, 192, 31, 0.05)' 
                      : 'rgba(255,255,255,0.03)',
                    border: review.friendName === 'You'
                      ? '1px solid rgba(239, 192, 31, 0.2)'
                      : '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '0.75rem',
                      background: review.friendName === 'You' 
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #efc01f, #ff8400)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}>
                      {review.friendAvatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontWeight: 500 }}>
                        {review.friendName}
                        {review.friendName === 'You' && (
                          <span style={{ color: '#10b981', fontSize: '12px', marginLeft: '0.5rem' }}>Your rating</span>
                        )}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                        {new Date(review.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  {review.note && (
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.5 }}>
                      "{review.note}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Ratings Yet */}
        {friendCount === 0 && (
          <div style={{
            marginTop: '1.5rem',
            padding: '2rem',
            borderRadius: '1.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '2rem' }}>⭐</span>
            <h3 style={{ color: 'white', fontWeight: 600, marginTop: '0.75rem' }}>No ratings yet</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '0.5rem' }}>
              Be the first to rate this temple!
            </p>
          </div>
        )}

        {/* Quick Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
          {[
            { icon: Clock, label: 'Timings', value: temple.timings },
            { icon: Calendar, label: 'Best Time', value: temple.bestTime },
            { icon: Shirt, label: 'Dress Code', value: temple.dressCode },
            { icon: Users, label: 'Deity', value: temple.deity },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                borderRadius: '1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <item.icon size={16} color="#efc01f" />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.label}
                </span>
              </div>
              <p style={{ color: 'white', fontSize: '14px' }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Special Features */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          borderRadius: '1.5rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h2 style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.75rem' }}>Highlights</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {temple.specialFeatures.map((feature, index) => (
              <span
                key={index}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  background: 'rgba(239, 192, 31, 0.1)',
                  color: '#efc01f',
                  fontSize: '14px',
                  border: '1px solid rgba(239, 192, 31, 0.2)'
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Map Preview */}
        <button
          onClick={openMaps}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '1.25rem',
            borderRadius: '1.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'left',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem' }}>Location</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '0.25rem' }}>{temple.location}</p>
            </div>
            <ExternalLink size={20} color="#efc01f" />
          </div>
          <div style={{
            marginTop: '1rem',
            height: '8rem',
            borderRadius: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <MapPin size={32} color="#efc01f" />
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '0.5rem' }}>Tap to open in Maps</p>
          </div>
        </button>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          temple={temple}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  )
}

export default TempleDetail
