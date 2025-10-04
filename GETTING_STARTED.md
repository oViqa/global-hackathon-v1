# 🚀 Getting Started in 5 Minutes

The fastest way to get Pudding Gabel running on your machine.

## ⚡ TL;DR (Quick Commands)

```bash
# 1. Make sure PostgreSQL is running, then create database
createdb puddingmeetup

# 2. Run the automated setup script
chmod +x QUICKSTART.sh
./QUICKSTART.sh

# 3. Start backend (Terminal 1)
cd backend && npm run dev

# 4. Start frontend (Terminal 2)
cd frontend && npm run dev

# 5. Open browser
# Visit: http://localhost:3000
# Login: user1@puddingmeetup.com / password123
```

## 📋 Prerequisites Check

Before starting, verify you have these installed:

```bash
# Check Node.js (need 20+)
node --version
# Should show: v20.x.x or higher

# Check npm
npm --version
# Should show: 10.x.x or higher

# Check PostgreSQL (need 15+)
psql --version
# Should show: psql (PostgreSQL) 15.x or higher

# Check if PostgreSQL is running
pg_isready
# Should show: accepting connections
```

If any are missing, install them first:
- **Node.js:** https://nodejs.org (download LTS version)
- **PostgreSQL:** https://www.postgresql.org/download

## 🏗️ Setup Steps (Manual)

If the automated script doesn't work, follow these manual steps:

### Step 1: Create Database

```bash
# Option A: Using createdb command
createdb puddingmeetup

# Option B: Using psql
psql postgres
CREATE DATABASE puddingmeetup;
\q
```

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies (takes 1-2 minutes)
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed with demo data (10 events, 5 users)
npm run seed

# Start the server
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📡 WebSocket server ready
```

### Step 3: Setup Frontend (New Terminal)

```bash
cd frontend

# Install dependencies (takes 2-3 minutes)
npm install

# Start the dev server
npm run dev
```

You should see:
```
▲ Next.js 14.0.4
- Local: http://localhost:3000
```

### Step 4: Open in Browser

Navigate to: **http://localhost:3000**

You should see:
- 🗺️ Interactive map of Germany
- 📍 10 pudding event markers scattered across cities
- 🍮 "Pudding Gabel" header

## 🧪 Test the App

### 1. View Events
- Click on any pudding marker on the map
- See event details in the popup
- Try clicking different markers

### 2. Login
- Click "Login" button (top right)
- Email: `user1@puddingmeetup.com`
- Password: `password123`
- Click "Login"

### 3. Create Event
- Click the "+" button (bottom right)
- Fill in event details:
  - Title: "Test Pudding Party"
  - City: "Berlin"
  - State: "Berlin"
  - Date: Tomorrow
  - Time: 15:00
  - Attendee Limit: 10
- Click "Create Event"
- Your event appears on the map! 🎉

## 🔧 Common Issues

### Issue: "createdb: command not found"

**Solution:** Add PostgreSQL to your PATH or use psql:
```bash
psql postgres -c "CREATE DATABASE puddingmeetup;"
```

### Issue: "ECONNREFUSED" or "Can't reach database server"

**Solution:** PostgreSQL isn't running. Start it:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Start "PostgreSQL" service from Services app
```

### Issue: Port 3001 or 3000 already in use

**Solution:** Kill the process or use different port:
```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change port in backend/.env
PORT=3002
```

### Issue: npm install fails with errors

**Solution:** Clear npm cache and retry:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Prisma Client not initialized"

**Solution:** Generate Prisma client:
```bash
cd backend
npx prisma generate
```

### Issue: Frontend shows blank white page

**Solution:** Check browser console (F12) for errors. Common fixes:
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Make sure backend is running on port 3001
- Check `.env.local` file has correct API URL

## 📂 Project Structure Quick Reference

```
pudding-gabel/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, uploads, errors
│   │   ├── utils/        # Helper functions
│   │   ├── server.ts     # Main server file
│   │   ├── socket.ts     # WebSocket handlers
│   │   └── seed.ts       # Demo data seeder
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── uploads/          # Uploaded photos
│
├── frontend/             # Next.js 14 app
│   ├── src/
│   │   ├── app/          # Pages (Next.js 14 App Router)
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities, API client
│   │   └── store/        # Zustand state management
│   └── public/           # Static assets
│
└── docs/                 # Documentation
    ├── README.md
    ├── SETUP.md
    ├── DEPLOYMENT.md
    ├── ARCHITECTURE.md
    └── ...
```

## 🎓 Next Steps

Now that everything is running:

1. **Explore the Map**
   - Click on different event markers
   - Check out events in different cities

2. **Try Different Users**
   - Logout and login as different users:
     - user2@puddingmeetup.com / password123
     - user3@puddingmeetup.com / password123

3. **Create Your Own Event**
   - Click the "+" button
   - Fill in your pudding meetup details
   - Submit and see it on the map

4. **Read the Code**
   - Backend: Start with `backend/src/server.ts`
   - Frontend: Start with `frontend/src/app/page.tsx`
   - Database: Check `backend/prisma/schema.prisma`

5. **Check the Documentation**
   - [SETUP.md](SETUP.md) - Detailed setup guide
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to production
   - [TODO.md](TODO.md) - Remaining tasks

## 🐛 Still Having Issues?

1. **Check the logs:**
   - Backend: Look at terminal output
   - Frontend: Check browser console (F12)

2. **Verify environment files:**
   - `backend/.env` should exist
   - `frontend/.env.local` should exist

3. **Reset everything:**
   ```bash
   cd backend
   npx prisma migrate reset  # ⚠️ Deletes all data
   npm run seed
   ```

4. **Check the detailed guides:**
   - [SETUP.md](SETUP.md) has extensive troubleshooting
   - [PROJECT_STATUS.md](PROJECT_STATUS.md) shows what's implemented

## 💡 Pro Tips

- **View Database:** Run `npx prisma studio` in backend directory
- **API Testing:** Backend API is at http://localhost:3001/api
- **Hot Reload:** Both frontend and backend auto-reload on file changes
- **Demo Data:** Run `npm run seed` in backend to reset demo data
- **Check Health:** Visit http://localhost:3001/health

## 🎉 You're All Set!

Your Pudding Gabel Meetup Platform is now running locally.

**What you can do:**
- ✅ View events on the map
- ✅ Login/register users
- ✅ Create new events
- ✅ Explore the codebase

**What's next:**
- 🔨 Complete remaining features (see TODO.md)
- 🚀 Deploy to production (see DEPLOYMENT.md)
- 🎬 Record demo video (see DEMO_SCRIPT.md)

---

Happy pudding meetup organizing! 🍮✨

**Need help?** Check the documentation or open an issue on GitHub.
