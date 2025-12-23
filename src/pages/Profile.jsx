import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Settings, ChevronRight, MapPin, Award, 
  CheckCircle2, TrendingUp
} from 'lucide-react'

function Profile({ temples }) {
  const visitedTemples = useMemo(() => 
    temples.filter(t => t.isVisited),
    [temples]
  )

  const stats = useMemo(() => ({
    totalVisited: visitedTemples.length,
    totalWishlisted: temples.filter(t => t.isWishlisted).length,
    statesVisited: new Set(visitedTemples.map(t => t.state)).size,
    religionsCovered: new Set(visitedTemples.map(t => t.religion)).size,
  }), [temples, visitedTemples])

  // Calculate user level based on visits
  const level = useMemo(() => {
    if (stats.totalVisited >= 50) return { name: 'Enlightened Traveler', emoji: '🕉️', tier: 5 }
    if (stats.totalVisited >= 25) return { name: 'Devoted Pilgrim', emoji: '🙏', tier: 4 }
    if (stats.totalVisited >= 10) return { name: 'Spiritual Seeker', emoji: '🪷', tier: 3 }
    if (stats.totalVisited >= 5) return { name: 'Temple Explorer', emoji: '🛕', tier: 2 }
    return { name: 'New Devotee', emoji: '✨', tier: 1 }
  }, [stats.totalVisited])

  return (
    <div style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))', paddingBottom: '6rem' }}>
      {/* Header */}
      <header style={{ padding: '1rem 1.5rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white' }}>Profile</h1>
        <button style={{
          padding: '0.5rem',
          borderRadius: '0.75rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          cursor: 'pointer'
        }}>
          <Settings size={20} color="rgba(255, 255, 255, 0.6)" />
        </button>
      </header>

      {/* Profile Card */}
      <div style={{ padding: '0 1.5rem', marginTop: '1rem' }}>
        <div style={{
          borderRadius: '1.5rem',
          padding: '1.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '1rem',
              background: 'linear-gradient(135deg, #efc01f, #ff8400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem'
            }}>
              {level.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>Sahil</h2>
              <p style={{ color: '#efc01f', fontSize: '14px', fontWeight: 500, marginTop: '0.125rem' }}>{level.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '1rem',
                      height: '0.25rem',
                      borderRadius: '9999px',
                      background: i < level.tier ? '#efc01f' : 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ padding: '0 1.5rem', marginTop: '1.5rem' }}>
        <h3 style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Your Journey
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { icon: CheckCircle2, color: '#10b981', label: 'Temples Visited', value: stats.totalVisited },
            { icon: MapPin, color: '#e4724e', label: 'States Explored', value: stats.statesVisited },
            { icon: Award, color: '#efc01f', label: 'In Wishlist', value: stats.totalWishlisted },
            { icon: TrendingUp, color: '#ff8400', label: 'Traditions', value: stats.religionsCovered },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                borderRadius: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <stat.icon size={16} color={stat.color} />
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>{stat.label}</span>
              </div>
              <p style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white' }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Preview */}
      <div style={{ padding: '0 1.5rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Achievements
          </h3>
          <button style={{ color: '#efc01f', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div style={{
          padding: '1rem',
          borderRadius: '1rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {[
              { emoji: '🏛️', label: 'First Visit', unlocked: true, color: '#efc01f' },
              { emoji: '🗺️', label: 'Explorer', unlocked: true, color: '#10b981' },
              { emoji: '🏔️', label: 'Pilgrim', unlocked: false },
              { emoji: '⭐', label: 'Reviewer', unlocked: false },
            ].map((achievement, index) => (
              <div key={index} style={{ flexShrink: 0, textAlign: 'center' }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  opacity: achievement.unlocked ? 1 : 0.4,
                  background: achievement.unlocked 
                    ? `linear-gradient(135deg, ${achievement.color}20, ${achievement.color}10)`
                    : 'rgba(255, 255, 255, 0.05)',
                  border: achievement.unlocked 
                    ? `1px solid ${achievement.color}30`
                    : '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {achievement.emoji}
                </div>
                <p style={{ 
                  color: achievement.unlocked ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)',
                  fontSize: '10px',
                  marginTop: '0.375rem'
                }}>
                  {achievement.unlocked ? achievement.label : 'Locked'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visited Temples */}
      {visitedTemples.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Visited Temples
            </h3>
          </div>
          <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '2rem' }}>
            {visitedTemples.map((temple) => (
              <Link 
                key={temple.id} 
                to={`/temple/${temple.id}`}
                style={{
                  display: 'block',
                  padding: '1rem',
                  borderRadius: '1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  textDecoration: 'none'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <img
                    src={temple.image}
                    alt={temple.name}
                    style={{ width: '5rem', height: '5rem', borderRadius: '0.75rem', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ color: 'white', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {temple.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.25rem' }}>
                      <MapPin size={12} color="#efc01f" />
                      <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {temple.location}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem' }}>
                      <CheckCircle2 size={12} color="#10b981" />
                      <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 500 }}>Visited</span>
                    </div>
                  </div>
                  <ChevronRight size={20} color="rgba(255, 255, 255, 0.3)" style={{ alignSelf: 'center', flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {visitedTemples.length === 0 && (
        <div style={{ padding: '0 1.5rem', marginTop: '2rem', textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛕</div>
          <h3 style={{ color: 'white', fontSize: '1.125rem', marginBottom: '0.5rem' }}>Start Your Journey</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', maxWidth: '250px', margin: '0 auto', marginBottom: '1.5rem' }}>
            Visit temples and mark them as visited to track your spiritual journey
          </p>
          <Link 
            to="/explore"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              background: '#efc01f',
              color: 'black',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            <TrendingUp size={18} />
            Explore Temples
          </Link>
        </div>
      )}
    </div>
  )
}

export default Profile
