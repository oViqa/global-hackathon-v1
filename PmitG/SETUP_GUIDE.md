# 🚀 How to Run PuddingmitGabel Website

This guide explains how to run the PuddingmitGabel full-stack website using `npm run dev`.

## 📋 Prerequisites

Before you start, make sure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## 🎯 Quick Start

### Step 1: Navigate to the Project Directory

```bash
cd /home/runner/work/global-hackathon-v1/global-hackathon-v1/PmitG
```

Or if you're in the repository root:

```bash
cd PmitG
```

### Step 2: Install Dependencies

Run the following command to install all dependencies for both frontend and backend:

```bash
npm run install:all
```

This command will:
- Install root-level dependencies (concurrently)
- Install server dependencies (Express, SQLite3, CORS)
- Install client dependencies (React, Vite, Tailwind CSS)

### Step 3: Run the Development Server

```bash
npm run dev
```

This single command will start **both** servers simultaneously:
- **Backend API** on `http://localhost:5000`
- **Frontend** on `http://localhost:5173`

### Step 4: Open in Browser

Once both servers are running, open your web browser and visit:

```
http://localhost:5173
```

You should see the PuddingmitGabel homepage!

## 🎨 What You'll See

The website includes:
- **Homepage** - Brand story and call-to-action
- **Products** - Browse 6 premium pudding varieties
- **Shopping Cart** - Add/remove items, adjust quantities
- **Checkout** - Place orders with customer information

## 🛠️ Available Commands

From the `PmitG/` directory:

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install all dependencies (root, server, client) |
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run server` | Start only the backend server |
| `npm run client` | Start only the frontend |
| `npm run build` | Build the frontend for production |

## 🔍 Testing the API

You can test the backend API directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all products
curl http://localhost:5000/api/products

# Get single product
curl http://localhost:5000/api/products/1
```

## 🗄️ Database

The application uses SQLite3. The database file (`pudding.db`) is automatically created in the `server/` directory when you first run the server. It comes pre-populated with 6 sample products.

## 🚨 Troubleshooting

### Port Already in Use

If you get an error that port 5000 or 5173 is already in use:

1. **Stop any running servers** (press `Ctrl+C` in the terminal)
2. **Check for processes using the ports:**
   ```bash
   lsof -ti:5000  # Check backend port
   lsof -ti:5173  # Check frontend port
   ```
3. **Kill the processes if needed:**
   ```bash
   kill -9 $(lsof -ti:5000)
   kill -9 $(lsof -ti:5173)
   ```

### Dependencies Not Installing

If `npm run install:all` fails:

1. **Manually install dependencies:**
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   cd ..
   ```

### Database Issues

If products aren't showing up:

1. **Delete the database file:**
   ```bash
   rm server/pudding.db
   ```
2. **Restart the server** - it will recreate the database with sample products

## 🎉 Success!

You should now have:
- ✅ Both servers running
- ✅ Frontend accessible at http://localhost:5173
- ✅ Backend API at http://localhost:5000
- ✅ Sample products loaded in the database

Happy pudding shopping! 🍮

## 📞 Need Help?

If you encounter any issues, check the terminal output for error messages. The application logs helpful information about:
- Server startup status
- Database connection
- Product insertion
- API requests

---

**Built for the ACTA Global Hackathon**
