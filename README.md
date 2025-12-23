# Mandir - Temple Discovery App 🕉️

A beautiful mobile-first web application for discovering and tracking visits to sacred temples across India. Similar to Beli but for temples.

## Features

- 🏛️ **Browse Temples** - Explore a curated collection of famous temples across India
- 🔍 **Search & Filter** - Find temples by name, location, deity, or state
- ❤️ **Wishlist** - Save temples you want to visit
- ✅ **Track Visits** - Mark temples as visited to track your spiritual journey
- 📊 **Profile Stats** - View your journey statistics and achievements
- 📍 **Directions** - Get directions to any temple via Google Maps
- 📱 **Mobile-First Design** - Optimized for iPhone with safe area support

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icons
- **Vite** - Fast build tool

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

```bash
npm run build
npm run preview
```

## Converting to Native iOS App

This project is designed to be easily converted to a native iOS app. Options include:

1. **Capacitor** - Wrap the web app in a native container
2. **React Native** - Port the components to React Native
3. **PWA** - Add to home screen for app-like experience

## Project Structure

```
src/
├── components/     # Reusable UI components
├── data/          # Sample temple data
├── pages/         # Page components (Home, Explore, etc.)
├── App.jsx        # Main app with routing
├── main.jsx       # Entry point
└── index.css      # Global styles
```

## Customization

- **Colors**: Edit `tailwind.config.js` to change the color palette
- **Fonts**: Update Google Fonts link in `index.html`
- **Data**: Modify `src/data/temples.js` to add/edit temples

## License

MIT

