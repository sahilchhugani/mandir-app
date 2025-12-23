import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronRight } from 'lucide-react'
import TempleCard from '../components/TempleCard'
import { categories } from '../data/temples'

function Home({ temples, toggleWishlist }) {
  const featuredTemples = temples.slice(0, 5)
  
  const categoriesWithCounts = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      count: temples.filter(cat.filter).length
    })).filter(cat => cat.count > 0)
  }, [temples])

  return (
    <div style={{ paddingTop: '1rem', paddingBottom: '6rem', minHeight: '100vh', background: '#342920' }}>
      {/* Header */}
      <header style={{ padding: '0 1.25rem', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ color: 'rgba(212, 175, 87, 0.7)', fontSize: '11px', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Welcome
            </p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 300, color: 'white', marginTop: '0.25rem', letterSpacing: '-0.01em' }}>
              Discover Temples
            </h1>
          </div>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            background: 'rgba(212, 175, 87, 0.1)',
            border: '1px solid rgba(212, 175, 87, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L12 5M12 5C9.5 5 7.5 6.5 7.5 8.5V10H16.5V8.5C16.5 6.5 14.5 5 12 5Z" stroke="#d4af57" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M6 10V19H18V10" stroke="#d4af57" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M9 10V19M15 10V19" stroke="#d4af57" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="12" cy="3" r="1" fill="#d4af57"/>
            </svg>
          </div>
        </div>
        
        {/* Search Bar */}
        <Link to="/explore" style={{ display: 'block', textDecoration: 'none' }}>
          <div style={{
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <Search size={18} color="rgba(255, 255, 255, 0.4)" strokeWidth={1.5} />
            <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px', fontWeight: 300 }}>
              Search temples...
            </span>
          </div>
        </Link>
      </header>

      {/* Categories */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ padding: '0 1.25rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Categories
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '10px', padding: '0 1.25rem', overflowX: 'auto', paddingBottom: '8px' }} className="hide-scrollbar">
          {categoriesWithCounts.map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?category=${cat.name}`}
              style={{
                flexShrink: 0,
                borderRadius: '12px',
                padding: '14px 16px',
                minWidth: '110px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
              className="card-hover"
            >
              <span style={{ fontSize: '1.5rem', opacity: 0.9 }}>{cat.icon}</span>
              <p style={{ color: 'white', fontSize: '13px', fontWeight: 400, marginTop: '8px' }}>{cat.name}</p>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '11px', marginTop: '2px' }}>{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Featured
          </h2>
          <Link to="/explore" style={{ color: '#d4af57', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '2px', textDecoration: 'none', fontWeight: 400 }}>
            See all <ChevronRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '12px', padding: '0 1.25rem', overflowX: 'auto', paddingBottom: '8px' }} className="hide-scrollbar">
          {featuredTemples.map((temple) => (
            <TempleCard 
              key={temple.id} 
              temple={temple} 
              onToggleWishlist={toggleWishlist}
              size="compact"
            />
          ))}
        </div>
      </section>

      {/* Popular */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Popular
          </h2>
        </div>
        <div style={{ padding: '0 1.25rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {temples.slice(0, 3).map((temple) => (
            <TempleCard 
              key={temple.id} 
              temple={temple} 
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ marginTop: '2rem', padding: '0 1.25rem', marginBottom: '1rem' }}>
        <div style={{
          borderRadius: '16px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <h3 style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Your Journey
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 300, color: '#d4af57' }}>
                {temples.filter(t => t.isVisited).length}
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '11px', marginTop: '4px', fontWeight: 300 }}>Visited</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}>
                {temples.filter(t => t.isWishlisted).length}
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '11px', marginTop: '4px', fontWeight: 300 }}>Saved</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}>
                {new Set(temples.filter(t => t.isVisited).map(t => t.state)).size}
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '11px', marginTop: '4px', fontWeight: 300 }}>States</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
