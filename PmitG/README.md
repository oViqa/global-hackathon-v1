# 🍮 PuddingmitGabel - Premium Pudding E-Commerce Website

A full-stack e-commerce website for PuddingmitGabel, a premium pudding brand with 130+ years of tradition.

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **SQLite3** - Lightweight database
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
PmitG/
├── server/              # Backend application
│   ├── server.js       # Express server & API routes
│   ├── package.json    # Server dependencies
│   └── pudding.db      # SQLite database (auto-created)
├── client/              # Frontend application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context (Cart)
│   │   ├── App.jsx     # Main app component
│   │   └── main.jsx    # Entry point
│   ├── index.html      # HTML template
│   ├── vite.config.js  # Vite configuration
│   └── package.json    # Client dependencies
└── package.json         # Root scripts
```

## 🎯 Features

- **Product Catalog** - Browse premium pudding varieties
- **Shopping Cart** - Add, remove, and update quantities
- **Checkout System** - Simple order placement
- **Responsive Design** - Works on all devices
- **Premium Branding** - Rich history and modern aesthetics

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Quick Start

1. **Navigate to the project directory:**
   ```bash
   cd /home/runner/work/global-hackathon-v1/global-hackathon-v1/PmitG
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

This will start:
- **Backend server** on `http://localhost:5000`
- **Frontend** on `http://localhost:5173`

4. **Open your browser and visit:**
   ```
   http://localhost:5173
   ```

## 📜 Available Scripts

From the root `PmitG/` directory:

- `npm run install:all` - Install all dependencies (root, server, client)
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend
- `npm run build` - Build the frontend for production

## 🗄️ Database

The application uses SQLite3 for data storage. The database (`pudding.db`) is automatically created with sample products when you first run the server.

### Sample Products
- Classic Vanilla Pudding - $4.99
- Chocolate Dream - $5.49
- Caramel Delight - $5.99
- Berry Bliss - $6.49
- Matcha Magic - $6.99
- Pistachio Paradise - $7.49

## 🌐 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders

### Health Check
- `GET /api/health` - Check API status

## 🎨 Design System

The website uses a custom "pudding" color palette:
- Primary: `#e87d0f` (warm orange-brown)
- Light: `#fef8f0` (cream)
- Dark: `#722d0f` (deep brown)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `client/dist` folder

### Backend (Railway/Render)
1. Deploy the `server` folder
2. Set environment variable: `PORT=5000`

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

This is a hackathon project. Feel free to fork and extend!

---

**Built with ❤️ for the ACTA Global Hackathon**
