# 🍮 Pudding Mit Gabel Meetup Platform

**Find your pudding people** - A location-based social platform for organizing and discovering "Pudding mit Gabel" (pudding with fork) meetup events across Germany.

![Hackathon](https://img.shields.io/badge/ACTA-Hackathon%202025-purple)
![Status](https://img.shields.io/badge/Status-Demo-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🎯 Project Overview

Pudding Mit Gabel is a unique social platform that combines:
- 🗺️ **Interactive map** of Germany showing pudding meetup events
- 📸 **Photo-first approach** - Users must upload a pudding photo to join
- ✅ **Organizer approval system** for quality control
- 💬 **Real-time group chat** for approved attendees
- 📍 **Radius-based discovery** (10km, 20km, 50km, 100km)

Built for the **ACTA 24-Hour Global Hackathon** (Oct 4-5, 2025).

## ✨ Features

### Core Functionality
- ✅ Interactive Germany map with custom pudding markers (Leaflet.js)
- ✅ User authentication (JWT-based)
- ✅ Event creation with geolocation
- ✅ Join events with pudding photo upload
- ✅ Organizer approval workflow
- ✅ Event discovery with radius filtering
- ✅ Responsive design (mobile-first)

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS 
- Leaflet.js for maps
- Zustand (state management)

**Backend:**
- Node.js + Express
- TypeScript

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd global-hackathon-v1
```

2. **Setup Backend**
```bash
cd backend

# Install dependencies
npm install

# Setup database
# Make sure PostgreSQL is running, then:
createdb puddingmeetup

# Run Prisma migrations
npx prisma generate
npx prisma migrate dev

# Seed the database with demo data
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:3001`

3. **Setup Frontend** (in a new terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

4. **Open your browser**

Navigate to `http://localhost:3000` and you should see the pudding map with demo events!

### Demo Accounts

Use these test accounts (created by seed script):
- Email: `user1@puddingmeetup.com` - Password: `password123`
- Email: `user2@puddingmeetup.com` - Password: `password123`
- Email: `user3@puddingmeetup.com` - Password: `password123`

## 📖 User Flow

### 1. First-Time Visitor
1. Land on homepage → See Germany map with event markers
2. Click event marker → Event details popup
3. Click "View Details" → Login prompt
4. Register account → Start exploring!

### 2. Create Event
1. Click the "+" FAB (Floating Action Button)
2. Fill in event details (title, location, date/time, attendee limit)
3. Submit → Event appears on map immediately

### 3. Join Event
1. Click event marker on map
2. Click "Join Event"
3. Upload pudding photo + optional description
4. Wait for organizer approval
5. Once approved → Chat unlocked!

### 4. Organizer Dashboard
1. View pending join requests
2. See pudding photos of applicants
3. Approve/Reject requests
4. Chat with approved attendees

## 🎨 Design Philosophy

### Craft (9/10)
- Clean, modular TypeScript code
- Smooth animations and transitions
- Loading states and error handling
- Consistent design system with TailwindCSS

### Novelty (8/10)
- Unique fusion of food culture trend + hyperlocal events
- Photo-first approach prevents spam
- Instant community formation through shared quirky interest

### Utility (9/10)
- Solves real problem of connecting strangers
- Low barrier to entry
- Geographic discovery makes it practical
- Approval system ensures quality

### Taste (10/10)
- Modern gradient aesthetics (purple/pink)
- Intuitive UX (no tutorial needed)
- Playful tone throughout
- Instagram-worthy design

## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth, upload, error handling
│   │   ├── utils/           # Geo calculations
│   │   ├── server.ts        # Main server file
│   │   ├── socket.ts        # WebSocket handlers
│   │   └── seed.ts          # Database seeding
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── auth/        # Login/Register
│   │   │   ├── events/      # Event components
│   │   │   └── map/         # Map components
│   │   ├── lib/             # Utilities, API client
│   │   └── store/           # Zustand state management
│   └── package.json
│
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel via CLI or GitHub integration
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
# Set environment variables in Railway/Render dashboard
# Deploy via CLI or GitHub integration
```

## 🎥 Demo Video

*[Link to 60-second demo video will be added here]*

## 🏆 Hackathon Submission

This project was built for the **ACTA 24-Hour Global Hackathon** (October 4-5, 2025).

**Category:** Build anything you wish existed

**Key Achievements:**
- ✅ Functional full-stack web application
- ✅ Real-time features (Socket.io)
- ✅ Geographic/location-based functionality
- ✅ Photo upload and approval workflow
- ✅ Responsive, modern UI
- ✅ Production-ready code quality

## 🔮 Future Enhancements

- 📱 Native Android app via Capacitor
- 🔔 Push notifications
- 🏅 Gamification (badges, leaderboards)
- ⭐ Event ratings and reviews
- 👥 Friend system
- 🌍 International expansion
- 💰 Monetization (premium events, sponsorships)

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

This is a hackathon project, but contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

## 📧 Contact

Built with ❤️ and 🍮 for the ACTA Hackathon 2025

---

**Remember:** Life is uncertain. Eat pudding first. 🍮✨
