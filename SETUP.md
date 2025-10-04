# 🚀 Setup Guide - Pudding Gabel Meetup Platform

This guide will help you get the project running locally in under 10 minutes.

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 20+ installed (`node --version`)
- ✅ PostgreSQL 15+ installed and running
- ✅ npm or yarn package manager
- ✅ Git

## Step-by-Step Setup

### 1. Database Setup

First, create the PostgreSQL database:

```bash
# Start PostgreSQL (if not already running)
# On macOS:
brew services start postgresql

# On Linux:
sudo systemctl start postgresql

# Create the database
createdb puddingmeetup

# Or using psql:
psql postgres
CREATE DATABASE puddingmeetup;
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# The .env file is already configured with default values
# Update DATABASE_URL in .env if your PostgreSQL credentials are different

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with demo data (10 events, 5 users)
npm run seed

# Start the backend server
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📡 WebSocket server ready
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
4. **Join Event:** Click an event marker, then "View Details", then "Join Event"

## Troubleshooting

### PostgreSQL Connection Error

If you see `Error: Can't reach database server`:

1. Check PostgreSQL is running: `pg_isready`
2. Update `DATABASE_URL` in `backend/.env` with correct credentials
3. Default format: `postgresql://USERNAME:PASSWORD@localhost:5432/puddingmeetup`

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

### Prisma Migration Issues

If migrations fail:

```bash
cd backend
npx prisma migrate reset  # ⚠️ This will delete all data
npx prisma migrate dev
npm run seed
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

### Database GUI

To view your database visually:

```bash
cd backend
npx prisma studio
```

Opens at: http://localhost:5555

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
npx prisma migrate reset
npm run seed
```

## Next Steps

Once everything is running:

1. ✅ Explore the map and click on events
2. ✅ Login with a test account
3. ✅ Create your own event
4. ✅ Join an existing event (upload a pudding photo!)
5. ✅ Check the organizer dashboard for approvals
6. ✅ Try the real-time chat feature

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for instructions on deploying to:
- Frontend: Vercel
- Backend: Railway or Render
- Database: Supabase or Railway PostgreSQL

## Need Help?

- Check the main [README.md](README.md) for more details
- Review the [comprehensive specification](CAHIER_DES_CHARGES.md)
- Open an issue on GitHub

---

Happy pudding meetup organizing! 🍮✨
