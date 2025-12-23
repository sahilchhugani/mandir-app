import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Navigation } from 'lucide-react'
import { formatDistance } from '../services/locationService'

function TempleCard({ temple, onToggleWishlist, size = 'normal' }) {
  const isCompact = size === 'compact'
  const [imageError, setImageError] = useState(false)
  
  return (
    <Link 
      to={`/temple/${temple.id}`}
      style={{
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px',
        width: isCompact ? '140px' : '100%',
        flexShrink: isCompact ? 0 : 1,
        textDecoration: 'none',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.04)',
        transition: 'background 0.2s ease',
      }}
      className="card-hover"
    >
      {/* Image */}
      <div style={{ 
        position: 'relative', 
        height: isCompact ? '160px' : '180px',
        background: '#1a1512',
      }}>
        {!imageError && temple.image ? (
          <img
            src={temple.image}
            alt={temple.name}
            onError={() => setImageError(true)}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1512 0%, #2a1f1a 100%)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
              <path d="M12 3L12 5M12 5C9.5 5 7.5 6.5 7.5 8.5V10H16.5V8.5C16.5 6.5 14.5 5 12 5Z" stroke="#d4af57" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M6 10V19H18V10" stroke="#d4af57" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M9 10V19M15 10V19" stroke="#d4af57" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="12" cy="3" r="1" fill="#d4af57"/>
            </svg>
          </div>
        )}
        
        {/* Gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(13,9,7,0.9) 100%)'
        }} />
        
        {/* Visited Badge */}
        {temple.isVisited && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            padding: '4px 8px',
            borderRadius: '6px',
            background: 'rgba(16, 185, 129, 0.9)',
            fontSize: '9px',
            fontWeight: 600,
            color: 'white',
            letterSpacing: '0.05em',
          }}>
            VISITED
          </div>
        )}
        
        {/* Heart */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleWishlist(temple.id)
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: temple.isWishlisted ? '#d4af57' : 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            transition: 'transform 0.15s ease',
          }}
          className="btn-press"
        >
          <Heart 
            size={14} 
            color={temple.isWishlisted ? '#0d0907' : 'white'}
            fill={temple.isWishlisted ? '#0d0907' : 'none'}
            strokeWidth={1.5}
          />
        </button>
      </div>
      
      {/* Content */}
      <div style={{ padding: isCompact ? '12px' : '14px' }}>
        <h3 style={{
          fontWeight: 400,
          color: 'white',
          fontSize: isCompact ? '13px' : '15px',
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {temple.name}
        </h3>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginTop: '6px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, flex: 1 }}>
            <MapPin size={11} color="rgba(255,255,255,0.35)" strokeWidth={1.5} />
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.4)', 
              fontSize: '11px',
              fontWeight: 300,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {temple.location?.split(',')[0]}
            </span>
          </div>
          
          {temple.distance !== undefined && temple.distance !== null && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '3px',
              flexShrink: 0,
              marginLeft: '8px',
            }}>
              <Navigation size={10} color="rgba(16, 185, 129, 0.7)" strokeWidth={1.5} />
              <span style={{ color: 'rgba(16, 185, 129, 0.8)', fontSize: '11px', fontWeight: 500 }}>
                {formatDistance(temple.distance)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default TempleCard
