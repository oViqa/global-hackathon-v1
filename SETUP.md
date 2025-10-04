# 🚀 Setup Guide - Pudding Gabel Meetup Platform

This guide will help you get the project running locally in under 10 minutes.

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 20+ installed (`node --version`)
- ✅ MongoDB installed and running
- ✅ npm or yarn package manager
- ✅ Git

## Step-by-Step Setup

### 1. MongoDB Setup

First, ensure MongoDB is running:

```bash
# Start MongoDB (if not already running)
# On macOS:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# On Windows:
# Start "MongoDB" service from Services app

# Verify MongoDB is running
mongosh --eval "db.version()"
```

MongoDB will automatically create the `puddingmeetup` database when the app first connects.

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# The .env file is already configured with default values
# Update MONGODB_URI in .env if your MongoDB is on a different host/port

# Seed the database with demo data (10 events, 5 users)
npm run seed

# Start the backend server
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 3001
```

### 3. Frontend Setup (New Terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

You should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

### 4. Access the Application

Open your browser and navigate to: **http://localhost:3000**

You should see:
- 🗺️ Interactive map of Germany
- 📍 10 pudding event markers
- 🍮 Pudding Gabel header

## Test Accounts

Use these pre-seeded accounts to login:

| Email | Password | Role |
|-------|----------|------|
| user1@puddingmeetup.com | password123 | User + Event Organizer |
| user2@puddingmeetup.com | password123 | User |
| user3@puddingmeetup.com | password123 | User |
| user4@puddingmeetup.com | password123 | User |
| user5@puddingmeetup.com | password123 | User |

## Quick Test Flow

1. **View Events:** Click on any pudding marker on the map
2. **Login:** Click "Login" button, use `user1@puddingmeetup.com` / `password123`
3. **Create Event:** Click the "+" button (bottom right)
4. **Join Event:** Click an event marker, then "View Details"

## Troubleshooting

### MongoDB Connection Error

If you see `Error: connect ECONNREFUSED`:

1. Check MongoDB is running: `mongosh`
2. Update `MONGODB_URI` in `backend/.env` with correct connection string
3. Default: `mongodb://localhost:27017/puddingmeetup`

### Port Already in Use

If port 3001 or 3000 is occupied:

**Backend (3001):**
```bash
# Change PORT in backend/.env
PORT=3002
```

**Frontend (3000):**
```bash
# Next.js will automatically try port 3001, 3002, etc.
# Or specify: next dev -p 3002
```

### Missing Dependencies

If you see module not found errors:

```bash
# Backend
cd backend && rm -rf node_modules package-lock.json && npm install

# Frontend
cd frontend && rm -rf node_modules package-lock.json && npm install
```

## Development Tips

### View Database

To view your MongoDB database:

```bash
# Using mongosh
mongosh puddingmeetup

# Show collections
show collections

# View users
db.users.find().pretty()

# View events
db.events.find().pretty()
```

Or use MongoDB Compass (GUI): https://www.mongodb.com/products/compass

### API Testing

Backend API runs at: http://localhost:3001

Test endpoints:
- GET http://localhost:3001/health
- GET http://localhost:3001/api/events

### Hot Reload

Both backend and frontend support hot reload:
- Backend: Save `.ts` files → Auto-restarts
- Frontend: Save `.tsx` files → Auto-refreshes browser

## Reset Demo Data

To reset all data and re-seed:

```bash
cd backend
npm run seed
```

This will:
1. Clear all existing data
2. Create 5 test users
3. Create 10 demo events
4. Add sample attendances and messages

## Next Steps

Once everything is running:

1. ✅ Explore the map and click on events
2. ✅ Login with a test account
3. ✅ Create your own event
4. ✅ Start building remaining features from TODO.md

## MongoDB Installation

If you don't have MongoDB installed:

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**Windows:**
Download from: https://www.mongodb.com/try/download/community

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for instructions on deploying to:
- Frontend: Vercel
- Backend: Railway or Render
- Database: MongoDB Atlas (free tier available)

## Need Help?

- Check the main [README.md](README.md) for more details
- Review the [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Open an issue on GitHub

---

Happy pudding meetup organizing! 🍮✨
