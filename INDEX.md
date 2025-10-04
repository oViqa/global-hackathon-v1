# 📚 Documentation Index

Welcome to the Pudding Gabel Meetup Platform documentation! This index will guide you to the right document based on what you need.

## 🚀 Getting Started (Choose Your Path)

### I want to run the app NOW (5 minutes)
→ **[GETTING_STARTED.md](GETTING_STARTED.md)** - Fastest setup with automated script

### I want detailed setup instructions
→ **[SETUP.md](SETUP.md)** - Step-by-step guide with troubleshooting

### I want to understand the project first
→ **[README.md](README.md)** - Project overview, features, tech stack

## 📖 Core Documentation

### For Developers

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [GETTING_STARTED.md](GETTING_STARTED.md) | Quick 5-minute setup | Right now, before coding |
| [SETUP.md](SETUP.md) | Detailed setup guide | If quick setup fails |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical deep dive | When modifying code |
| [TODO.md](TODO.md) | Remaining tasks | When continuing development |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Current progress | To see what's done/pending |

### For Deployment

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment | When deploying to Vercel/Railway |
| Environment Setup | Configure secrets | Before deploying |
| Domain Setup | Custom domains | After initial deploy |

### For Hackathon

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [DEMO_SCRIPT.md](DEMO_SCRIPT.md) | 60-second video script | When recording demo |
| [HACKATHON_NOTES.md](HACKATHON_NOTES.md) | Judging strategy | Before presenting |
| [FINAL_SUMMARY.md](FINAL_SUMMARY.md) | Project overview | When explaining to judges |

## 🗂️ Quick Reference by Task

### "I need to set this up"
1. Read [GETTING_STARTED.md](GETTING_STARTED.md)
2. Run the automated script
3. If issues, check [SETUP.md](SETUP.md)

### "I want to deploy this"
1. Complete remaining features from [TODO.md](TODO.md)
2. Follow [DEPLOYMENT.md](DEPLOYMENT.md)
3. Test production build

### "I need to understand the code"
1. Start with [README.md](README.md) - overview
2. Read [ARCHITECTURE.md](ARCHITECTURE.md) - technical details
3. Browse code files (start with `backend/src/server.ts` and `frontend/src/app/page.tsx`)

### "I'm creating the demo video"
1. Read [DEMO_SCRIPT.md](DEMO_SCRIPT.md) - full script
2. Check [HACKATHON_NOTES.md](HACKATHON_NOTES.md) - key points to emphasize
3. Record multiple takes

### "I'm presenting to judges"
1. Review [HACKATHON_NOTES.md](HACKATHON_NOTES.md) - judging criteria
2. Practice elevator pitch (30 seconds)
3. Prepare for common questions

### "I want to contribute"
1. Check [TODO.md](TODO.md) - see what needs doing
2. Read [ARCHITECTURE.md](ARCHITECTURE.md) - understand structure
3. Follow existing code patterns

## 📁 File Structure Overview

```
pudding-gabel-meetup/
│
├── 📄 Documentation (You are here!)
│   ├── README.md ........................ Project overview
│   ├── INDEX.md ......................... This file
│   ├── GETTING_STARTED.md ............... Quick start (5 min)
│   ├── SETUP.md ......................... Detailed setup
│   ├── DEPLOYMENT.md .................... Deploy to production
│   ├── ARCHITECTURE.md .................. Technical architecture
│   ├── DEMO_SCRIPT.md ................... Video demo script
│   ├── HACKATHON_NOTES.md ............... Judging strategy
│   ├── TODO.md .......................... Remaining tasks
│   ├── PROJECT_STATUS.md ................ Current progress
│   ├── FINAL_SUMMARY.md ................. Executive summary
│   └── QUICKSTART.sh .................... Automated setup script
│
├── 🔧 Backend (Express + PostgreSQL)
│   ├── src/
│   │   ├── routes/ ...................... API endpoints
│   │   ├── middleware/ .................. Auth, upload, errors
│   │   ├── utils/ ....................... Helpers
│   │   ├── server.ts .................... Main server
│   │   ├── socket.ts .................... WebSocket handlers
│   │   └── seed.ts ...................... Demo data
│   ├── prisma/
│   │   └── schema.prisma ................ Database schema
│   ├── package.json ..................... Dependencies
│   └── .env ............................. Environment config
│
├── 🎨 Frontend (Next.js 14)
│   ├── src/
│   │   ├── app/ ......................... Pages (App Router)
│   │   ├── components/ .................. React components
│   │   ├── lib/ ......................... Utilities, API
│   │   └── store/ ....................... State management
│   ├── package.json ..................... Dependencies
│   └── .env.local ....................... Environment config
│
└── 📦 Project Root
    ├── package.json ..................... Root scripts
    ├── LICENSE .......................... MIT License
    └── RULES.md ......................... Hackathon rules
```

## 🎯 Common Tasks

### Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# Or use root command
npm run install:all
```

### Start Development Servers
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

### Reset Demo Data
```bash
cd backend
npx prisma migrate reset
npm run seed
```

### View Database
```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

### Production Build
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## 🔍 Finding Specific Information

### Authentication System
- Backend: `backend/src/routes/auth.ts`
- Frontend: `frontend/src/store/authStore.ts`
- Docs: [ARCHITECTURE.md](ARCHITECTURE.md) → Security section

### Event Creation
- Backend: `backend/src/routes/events.ts`
- Frontend: `frontend/src/components/events/CreateEventDialog.tsx`
- Docs: [ARCHITECTURE.md](ARCHITECTURE.md) → API Endpoints

### Real-Time Chat
- Backend: `backend/src/socket.ts`
- Frontend: Not yet implemented (see [TODO.md](TODO.md))
- Docs: [ARCHITECTURE.md](ARCHITECTURE.md) → WebSocket Events

### Database Schema
- Schema: `backend/prisma/schema.prisma`
- Docs: [ARCHITECTURE.md](ARCHITECTURE.md) → Database Schema

### Map Integration
- Component: `frontend/src/components/map/MapView.tsx`
- Docs: [ARCHITECTURE.md](ARCHITECTURE.md) → Frontend Components

## 🆘 Troubleshooting

### Something's not working
1. Check [SETUP.md](SETUP.md) → Common Issues section
2. Check [GETTING_STARTED.md](GETTING_STARTED.md) → Common Issues
3. Verify environment variables in `.env` files
4. Check terminal output for error messages

### Database issues
→ [SETUP.md](SETUP.md) → PostgreSQL Connection Error

### Port conflicts
→ [GETTING_STARTED.md](GETTING_STARTED.md) → Issue: Port already in use

### Deployment problems
→ [DEPLOYMENT.md](DEPLOYMENT.md) → Troubleshooting section

## 📊 Project Statistics

- **Total Files:** 50+
- **Lines of Code:** ~7,700
- **API Endpoints:** 15+
- **Database Models:** 4
- **React Components:** 15+
- **Documentation:** 10 files, ~5,000 lines

## 🏆 Hackathon Resources

### Submission Checklist
- [ ] GitHub repo is public
- [ ] Live demo deployed
- [ ] 60-second video recorded
- [ ] 5+ git commits made
- [ ] README updated
- [ ] Submission form filled

### Key Documents for Judges
1. [README.md](README.md) - First impression
2. [HACKATHON_NOTES.md](HACKATHON_NOTES.md) - Judging criteria
3. [ARCHITECTURE.md](ARCHITECTURE.md) - Technical depth
4. [FINAL_SUMMARY.md](FINAL_SUMMARY.md) - Executive overview

## 🎓 Learning Path

### Beginner (Just started)
1. [README.md](README.md) - Understand what it does
2. [GETTING_STARTED.md](GETTING_STARTED.md) - Run it locally
3. Click around the app - explore features

### Intermediate (Want to modify)
1. [ARCHITECTURE.md](ARCHITECTURE.md) - Understand structure
2. [TODO.md](TODO.md) - See what needs doing
3. Browse code files - start with main files

### Advanced (Ready to deploy)
1. Complete features from [TODO.md](TODO.md)
2. Follow [DEPLOYMENT.md](DEPLOYMENT.md)
3. Record demo using [DEMO_SCRIPT.md](DEMO_SCRIPT.md)

## 🔗 External Resources

### Tech Stack Documentation
- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **Socket.io:** https://socket.io/docs
- **Leaflet:** https://leafletjs.com/reference.html
- **TailwindCSS:** https://tailwindcss.com/docs

### Deployment Platforms
- **Vercel:** https://vercel.com/docs
- **Railway:** https://docs.railway.app
- **Supabase:** https://supabase.com/docs

### Hackathon
- **ACTA:** https://www.acta.so/hackathon
- **Discord:** https://discord.gg/9KbH3f5M2a
- **Submission:** https://forms.acta.so/r/wMobdM

## 💡 Pro Tips

- 📖 Start with [GETTING_STARTED.md](GETTING_STARTED.md) if you want to run it immediately
- 🏗️ Read [ARCHITECTURE.md](ARCHITECTURE.md) if you're modifying code
- 🚀 Use [DEPLOYMENT.md](DEPLOYMENT.md) when deploying to production
- 🎬 Follow [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for demo video
- ✅ Check [TODO.md](TODO.md) for next steps

## 🎯 Your Next Step

**If you're setting up for the first time:**
→ Go to [GETTING_STARTED.md](GETTING_STARTED.md)

**If you're continuing development:**
→ Go to [TODO.md](TODO.md)

**If you're ready to deploy:**
→ Go to [DEPLOYMENT.md](DEPLOYMENT.md)

**If you're preparing for demo:**
→ Go to [DEMO_SCRIPT.md](DEMO_SCRIPT.md)

---

**Questions?** Check the relevant document above or open an issue on GitHub.

**Ready to start?** → [GETTING_STARTED.md](GETTING_STARTED.md) ⚡

Happy pudding meetup organizing! 🍮✨
