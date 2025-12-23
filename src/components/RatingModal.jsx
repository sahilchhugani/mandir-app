import { useState } from 'react'
import { X, Star } from 'lucide-react'
import { ratingCategories } from '../data/temples'

function RatingModal({ temple, onClose, onSubmit }) {
  const [ratings, setRatings] = useState({
    spiritual: 0,
    cleanliness: 0,
    accessibility: 0,
    crowdLevels: '',
    rituals: 0,
    hospitality: 0,
    culturalValue: 0,
  })
  const [note, setNote] = useState('')

  const handleRatingChange = (categoryId, value) => {
    setRatings(prev => ({ ...prev, [categoryId]: value }))
  }

  const handleSubmit = () => {
    // Check if at least one rating is filled
    const hasRating = Object.values(ratings).some(v => v !== 0 && v !== '')
    if (!hasRating) return

    onSubmit({
visitorId: 'currentUser',
      friendName: 'You',
      friendAvatar: '😊',
      date: new Date().toISOString().split('T')[0],
      ratings,
      note: note.trim(),
    })
    onClose()
  }

  const isValid = Object.values(ratings).some(v => v !== 0 && v !== '')

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        }}
      />
      
      {/* Modal */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        background: '#342920',
        borderTopLeftRadius: '1.5rem',
        borderTopRightRadius: '1.5rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem' }}>Rate This Temple</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px', marginTop: '0.25rem' }}>{temple.name}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={20} color="white" />
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
        }}>
          {/* Rating Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {ratingCategories.map(category => (
              <div key={category.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{category.icon}</span>
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{category.name}</span>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px', marginBottom: '0.75rem' }}>
                  {category.description}
                </p>
                
                {category.id === 'crowdLevels' ? (
                  // Crowd level selector
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['Calm', 'Moderate', 'Packed'].map(level => (
                      <button
                        key={level}
                        onClick={() => handleRatingChange('crowdLevels', level)}
                        style={{
                          flex: 1,
                          padding: '0.625rem',
                          borderRadius: '0.75rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 500,
                          background: ratings.crowdLevels === level
                            ? level === 'Calm' ? '#10b981' : level === 'Moderate' ? '#efc01f' : '#ef4444'
                            : 'rgba(255, 255, 255, 0.05)',
                          color: ratings.crowdLevels === level ? (level === 'Moderate' ? 'black' : 'white') : 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                ) : (
                  // Star rating
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(category.id, star)}
                        style={{
                          padding: '0.5rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'transform 0.1s',
                        }}
                      >
                        <Star
                          size={28}
                          color="#efc01f"
                          fill={star <= ratings[category.id] ? '#efc01f' : 'none'}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Note */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ color: 'white', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
              Add a note (optional)
            </label>
            <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px', marginBottom: '0.75rem' }}>
              Share tips or your experience with friends
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="The sunrise darshan was incredible..."
              maxLength={280}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.875rem',
                borderRadius: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <p style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '11px', textAlign: 'right', marginTop: '0.25rem' }}>
              {note.length}/280
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: isValid ? 'pointer' : 'not-allowed',
              fontSize: '15px',
              fontWeight: 600,
              background: isValid ? '#efc01f' : 'rgba(255, 255, 255, 0.1)',
              color: isValid ? 'black' : 'rgba(255, 255, 255, 0.3)',
            }}
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  )
}

export default RatingModal

