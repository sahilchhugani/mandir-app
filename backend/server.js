import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Security: HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to load
}));

// Security: Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Security: CORS - only allow specific origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (for mobile apps) only in development
    if (!origin) {
      if (process.env.NODE_ENV === 'production') {
        return callback(new Error('No origin header - blocked in production'));
      }
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('🚫 Blocked request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    hasApiKey: !!GOOGLE_API_KEY,
    timestamp: new Date().toISOString() 
  });
});

/**
 * Check if coordinates are in or near India (expanded bounds)
 */
function isInIndia(lat, lng) {
  // India's approximate bounding box (expanded slightly)
  // Lat: 6 to 37, Lng: 67 to 98
  const inIndia = lat >= 6 && lat <= 37 && lng >= 67 && lng <= 98;
  console.log(`📍 Location check: lat=${lat}, lng=${lng}, inIndia=${inIndia}`);
  return inIndia;
}

/**
 * Search for temples near a location
 * GET /api/temples?lat=28.6&lng=77.2&query=temple
 */
app.get('/api/temples', async (req, res) => {
  try {
    const { lat, lng, query, radius = 50000 } = req.query;
    
    if (!GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Google API key not configured' });
    }

    let url;
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const userInIndia = lat && lng && isInIndia(userLat, userLng);
    
    if (userInIndia) {
      // User is IN India - do multiple searches to get more results
      console.log('📍 User in India - searching nearby temples');
      
      const searchTerms = ['temple', 'mandir', 'hindu temple', 'shiva temple', 'vishnu temple'];
      const allResults = [];
      const seenIds = new Set();
      
      for (const term of searchTerms) {
        const params = new URLSearchParams({
          location: `${lat},${lng}`,
          radius: '100000', // 100km radius
          keyword: query || term,
          key: GOOGLE_API_KEY,
        });
        
        try {
          const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`;
          const searchResponse = await fetch(searchUrl);
          const searchData = await searchResponse.json();
          
          if (searchData.status === 'OK' && searchData.results) {
            for (const place of searchData.results) {
              if (!seenIds.has(place.place_id)) {
                seenIds.add(place.place_id);
                allResults.push(place);
              }
            }
          }
        } catch (err) {
          console.log(`⚠️ Search for "${term}" failed:`, err.message);
        }
      }
      
      console.log(`✅ Found ${allResults.length} unique temples from multiple searches`);
      
      // Filter to India and transform
      let temples = allResults.map((place, index) => transformPlace(place, index));
      temples = temples.filter(t => {
        if (!t.coordinates) return true;
        return isInIndia(t.coordinates.lat, t.coordinates.lng);
      });
      
      return res.json(temples);
    } else {
      // User is OUTSIDE India - search for famous temples in India
      console.log('🌍 User outside India - searching famous temples in India');
      const searchQuery = query 
        ? `${query} temple India`
        : 'famous hindu temples India';
      const params = new URLSearchParams({
        query: searchQuery,
        key: GOOGLE_API_KEY,
      });
      url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`;
    }

    console.log('🔍 Fetching from Google Places API...');
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
      let temples = (data.results || []).map((place, index) => transformPlace(place, index));
      
      // Filter to only include temples in India (remove Cambodia, etc.)
      temples = temples.filter(t => {
        if (!t.coordinates) return true;
        return isInIndia(t.coordinates.lat, t.coordinates.lng);
      });
      
      console.log(`✅ Found ${temples.length} temples (filtered to India)`);
      res.json(temples);
    } else {
      console.error('❌ Google API Error:', data.status, data.error_message);
      res.status(500).json({ 
        error: data.error_message || `Google API returned: ${data.status}` 
      });
    }
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get temple details by Place ID
 * GET /api/temples/:placeId
 */
app.get('/api/temples/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    
    if (!GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Google API key not configured' });
    }

    const params = new URLSearchParams({
      place_id: placeId,
      fields: 'name,formatted_address,geometry,rating,user_ratings_total,photos,opening_hours,reviews,website,formatted_phone_number,url',
      key: GOOGLE_API_KEY,
    });

    const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`;
    
    console.log('📍 Fetching temple details...');
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      res.json(transformPlace(data.result, 0));
    } else {
      res.status(500).json({ 
        error: data.error_message || `Google API returned: ${data.status}` 
      });
    }
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get photo - proxies Google's photo API
 * GET /api/photo?ref=PHOTO_REFERENCE&maxwidth=800
 */
app.get('/api/photo', async (req, res) => {
  try {
    const { ref, maxwidth = 800 } = req.query;
    
    if (!GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Google API key not configured' });
    }
    
    if (!ref) {
      return res.status(400).json({ error: 'Photo reference required' });
    }

    const params = new URLSearchParams({
      photoreference: ref,
      maxwidth: maxwidth.toString(),
      key: GOOGLE_API_KEY,
    });

    const url = `https://maps.googleapis.com/maps/api/place/photo?${params}`;
    
    // Fetch the image and pipe it to response
    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch photo' });
    }
    
    // Set content type
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    
    // Pipe the image data
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('❌ Photo error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Transform Google Place to our temple format
 */
function transformPlace(place, index, baseUrl = '') {
  // Get photo URL if available
  let imageUrl = null;
  if (place.photos && place.photos.length > 0) {
    const photoRef = place.photos[0].photo_reference;
    // Use the backend URL from environment or construct from request
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;
    imageUrl = `${backendUrl}/api/photo?ref=${encodeURIComponent(photoRef)}&maxwidth=800`;
  }

  // Extract state from address
  const addressParts = (place.formatted_address || place.vicinity || '').split(',');
  const state = addressParts.length >= 2 ? addressParts[addressParts.length - 2]?.trim() : '';

  return {
    id: place.place_id || `place_${index}`,
    placeId: place.place_id,
    name: place.name || 'Unknown Temple',
    hindiName: '',
    location: place.vicinity || addressParts.slice(0, 2).join(',').trim() || '',
    fullAddress: place.formatted_address || place.vicinity || '',
    state: state.replace(/\d+/g, '').trim(), // Remove postal codes
    deity: 'Various',
    religion: 'Hinduism',
    image: imageUrl,
    description: '',
    timings: place.opening_hours?.weekday_text?.[0] || 'Check locally',
    bestTime: 'Year round',
    dressCode: 'Modest clothing',
    coordinates: place.geometry?.location ? {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    } : null,
    googleRating: place.rating || 0,
    googleReviewCount: place.user_ratings_total || 0,
    isOpen: place.opening_hours?.open_now,
    website: place.website,
    phone: place.formatted_phone_number,
    googleMapsUrl: place.url,
    reviews: (place.reviews || []).slice(0, 3).map(r => ({
      author: r.author_name,
      rating: r.rating,
      text: r.text,
      time: r.relative_time_description,
    })),
    isWishlisted: false,
    isVisited: false,
    friendRatings: [],
  };
}

// Start server
app.listen(PORT, () => {
  console.log(`
🛕 Mandir Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━
📍 Running on: http://localhost:${PORT}
🔑 Google API: ${GOOGLE_API_KEY ? '✅ Configured' : '❌ Not configured'}

Endpoints:
  GET /api/health         - Health check
  GET /api/temples        - Search temples (query params: lat, lng, query, radius)
  GET /api/temples/:id    - Get temple details by Place ID
  GET /api/photo          - Get photo (query params: ref, maxwidth)
  `);
});

