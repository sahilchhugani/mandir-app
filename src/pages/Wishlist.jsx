import { useMemo } from 'react'
import { Heart } from 'lucide-react'
import TempleCard from '../components/TempleCard'

function Wishlist({ temples, toggleWishlist }) {
  const wishlistedTemples = useMemo(() => 
    temples.filter(t => t.isWishlisted),
    [temples]
  )

  return (
    <div style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))', paddingBottom: '6rem' }}>
      {/* Header */}
      <header style={{ padding: '1rem 1.5rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white' }}>Wishlist</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginTop: '0.25rem' }}>
          {wishlistedTemples.length} temple{wishlistedTemples.length !== 1 ? 's' : ''} saved
        </p>
      </header>

      {/* Content */}
      <div style={{ padding: '0 1.5rem' }}>
        {wishlistedTemples.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
            {wishlistedTemples.map((temple) => (
              <TempleCard 
                key={temple.id} 
                temple={temple} 
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{
              width: '6rem',
              height: '6rem',
              borderRadius: '9999px',
              margin: '0 auto',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <Heart size={40} color="rgba(255, 255, 255, 0.3)" />
            </div>
            <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No saved temples yet</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', maxWidth: '250px', margin: '0 auto' }}>
              Tap the heart icon on any temple to add it to your wishlist
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
