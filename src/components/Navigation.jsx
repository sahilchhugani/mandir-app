import { NavLink, useLocation } from 'react-router-dom'
import { Home, Compass, Heart, User } from 'lucide-react'

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/wishlist', icon: Heart, label: 'Wishlist' },
    { to: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'rgba(52, 41, 32, 0.98)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ 
        maxWidth: '28rem', 
        margin: '0 auto', 
        padding: '10px 20px', 
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
            
            return (
              <NavLink
                key={to}
                to={to}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  color: isActive ? '#d4af57' : 'rgba(255,255,255,0.35)',
                  background: isActive ? 'rgba(212, 175, 87, 0.08)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 1.8 : 1.5} />
                <span style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.02em' }}>{label}</span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
