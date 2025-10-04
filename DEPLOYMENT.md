# 🌐 Deployment Guide

This guide covers deploying the Pudding Gabel Meetup Platform to production.

## Architecture Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Vercel    │─────▶│  Railway    │─────▶│  Railway    │
│  (Frontend) │      │  (Backend)  │      │ (PostgreSQL)│
└─────────────┘      └─────────────┘      └─────────────┘
```

## Option 1: Quick Deploy (Recommended)

### Frontend → Vercel

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit - Pudding Gabel Meetup"
git push origin main
```

2. **Deploy to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Set Root Directory: `frontend`
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.railway.app
     NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app
     ```
   - Click Deploy

### Backend → Railway

1. **Create Railway Account:** https://railway.app

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will auto-generate `DATABASE_URL`

4. **Configure Backend Service:**
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   
5. **Set Environment Variables:**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-secure-secret-key-here
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```

6. **Run Migrations:**
   - In Railway dashboard, go to your backend service
   - Open "Settings" → "Deploy"
   - Add custom build command:
     ```
     npm run prisma:generate && npm run build
     ```
   - In "Variables" tab, add a deploy hook to run migrations

7. **Seed Database (Optional):**
   ```bash
   # Connect via Railway CLI
   railway login
   railway link
   railway run npm run seed
   ```

## Option 2: Alternative Platforms

### Frontend → Netlify

```bash
cd frontend
npm run build

# Deploy
npx netlify-cli deploy --prod
```

### Backend → Render

1. Create new Web Service on https://render.com
2. Connect GitHub repository
3. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add PostgreSQL database
5. Set environment variables (same as Railway)

## Database Setup

### Option A: Railway PostgreSQL (Included)

Already configured if you used Railway for backend.

### Option B: Supabase

1. Create project at https://supabase.com
2. Get connection string from Settings → Database
3. Update `DATABASE_URL` in backend environment variables
4. Run migrations:
   ```bash
   cd backend
   DATABASE_URL="your-supabase-url" npx prisma migrate deploy
   DATABASE_URL="your-supabase-url" npm run seed
   ```

### Option C: Railway Standalone PostgreSQL

1. Create new Railway project
2. Add PostgreSQL database only
3. Copy `DATABASE_URL`
4. Use in both local development and production

## Environment Variables Checklist

### Frontend (Vercel/Netlify)

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_WS_URL=wss://your-backend-url.com
```

### Backend (Railway/Render)

```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Post-Deployment Steps

### 1. Verify Backend

```bash
curl https://your-backend.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Verify Frontend

Visit your Vercel URL and check:
- ✅ Map loads correctly
- ✅ Events appear on map
- ✅ Login/Register works
- ✅ Create event works
- ✅ Real-time chat connects

### 3. Run Database Migrations

```bash
# Using Railway CLI
railway link
railway run npx prisma migrate deploy

# Or using connection string
DATABASE_URL="your-connection-string" npx prisma migrate deploy
```

### 4. Seed Production Database (Optional)

```bash
railway run npm run seed
# Or
DATABASE_URL="your-connection-string" npm run seed
```

## Custom Domain (Optional)

### Frontend (Vercel)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Vercel auto-provisions SSL certificate

### Backend (Railway)

1. Go to Service Settings → Networking
2. Add custom domain
3. Update DNS records
4. Railway auto-provisions SSL certificate

## Monitoring & Logs

### Vercel Logs

```bash
vercel logs [deployment-url]
```

Or view in Vercel dashboard: Deployments → [Your Deployment] → Logs

### Railway Logs

View in Railway dashboard:
1. Select your project
2. Click on backend service
3. Go to "Deployments" tab
4. Click "View Logs"

## Troubleshooting

### CORS Errors

Update `FRONTEND_URL` in backend environment variables to match your Vercel deployment URL.

### WebSocket Connection Failed

Ensure `NEXT_PUBLIC_WS_URL` uses `wss://` (not `ws://`) for production.

### Database Connection Issues

1. Check `DATABASE_URL` is correctly set
2. Verify PostgreSQL is running (Railway/Supabase dashboard)
3. Check connection string format:
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
   ```

### Build Failures

**Frontend:**
- Check all dependencies are in `package.json`
- Verify environment variables are set
- Check build logs for specific errors

**Backend:**
- Ensure Prisma client is generated during build
- Verify TypeScript compiles without errors
- Check `tsconfig.json` is correct

## Performance Optimization

### Frontend

1. **Enable CDN:** Vercel automatically uses CDN
2. **Image Optimization:** Already configured in `next.config.js`
3. **Caching:** Set appropriate cache headers

### Backend

1. **Connection Pooling:**
   ```typescript
   // In prisma client initialization
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL,
       },
     },
     // Add connection pool settings
   })
   ```

2. **Rate Limiting:** Already implemented in middleware

3. **Database Indexes:** Already defined in Prisma schema

## SSL Certificates

Both Vercel and Railway automatically provision and renew SSL certificates. No manual configuration needed! 🎉

## Backup Strategy

### Database Backups

**Railway:**
- Automatic daily backups (Pro plan)
- Manual backup: Use `pg_dump` via Railway CLI

**Supabase:**
- Automatic daily backups included
- Download via dashboard

```bash
# Manual backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20251005.sql
```

## Scaling

### Railway
- Automatic scaling based on usage
- Upgrade to Pro plan for more resources
- Add more instances in service settings

### Vercel
- Automatic scaling (serverless)
- No configuration needed
- Handles traffic spikes automatically

## Cost Estimates

### Free Tier (Perfect for Demo)

- **Vercel:** Free for personal projects
- **Railway:** $5 credit/month (enough for small apps)
- **Supabase:** Free tier (500MB database)

**Total:** $0-5/month for low traffic

### Production Scale

- **Vercel Pro:** $20/month
- **Railway Pro:** $20/month + usage
- **Database:** $10-25/month

**Total:** ~$50-65/month for moderate traffic

## Rollback Strategy

### Vercel
1. Go to Deployments
2. Select previous working deployment
3. Click "Promote to Production"

### Railway
1. Go to Deployments tab
2. Select previous deployment
3. Click "Redeploy"

## Health Checks

Add this to your monitoring:

```bash
# Backend health
curl https://your-backend.railway.app/health

# Frontend health
curl https://your-app.vercel.app

# Database check (via backend)
curl https://your-backend.railway.app/api/events
```

## Support

- **Vercel:** https://vercel.com/support
- **Railway:** https://railway.app/help
- **Supabase:** https://supabase.com/support

---

Your Pudding Gabel Meetup Platform is now live! 🍮🚀
