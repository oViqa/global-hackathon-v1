# 🍮 PmitG Monorepo

**Find your pudding people** - A location-based social platform for organizing and discovering "Pudding mit Gabel" (pudding with fork) meetup events across Germany.

## 🏗️ Monorepo Structure

This project uses a monorepo architecture with the following packages:

```
pmitg-monorepo/
├── apps/
│   ├── frontend/          # Next.js 14 App Router + TypeScript + TailwindCSS
│   └── backend/           # Node.js 20 + TypeScript + MongoDB
├── packages/
│   └── shared/            # Shared TypeScript interfaces and types
└── package.json           # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** and npm
- **MongoDB** (local or MongoDB Atlas)
- Git

### Installation

1. **Clone and install dependencies**
```bash
git clone <your-repo-url>
cd pmitg-monorepo
npm install
```

2. **Setup environment variables**
```bash
# Copy environment templates
cp apps/backend/.env.example apps/backend/.env
cp .env.example .env

# Edit the files with your configuration
```

3. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

4. **Start development servers**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:backend   # Runs on http://localhost:3001
npm run dev:frontend  # Runs on http://localhost:3000
```

5. **Open your browser**
Navigate to `http://localhost:3000` to see the pudding map!

## 📦 Package Details

### 🎨 Frontend (`@pmitg/frontend`)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS + shadcn/ui components
- **Maps**: Leaflet.js for interactive Germany map
- **State**: Zustand for state management
- **HTTP**: Axios for API calls
- **Real-time**: Socket.io-client

### ⚙️ Backend (`@pmitg/backend`)
- **Runtime**: Node.js 20
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with Mongoose ODM
- **Framework**: Express.js
- **Auth**: JWT tokens
- **Real-time**: Socket.io
- **Validation**: Joi schemas
- **File Upload**: Multer

### 🔗 Shared (`@pmitg/shared`)
- **TypeScript interfaces** for User, Event, Attendance, Message
- **API response types**
- **WebSocket event types**
- **Common utilities and constants**

## 🗄️ Database Schema

### MongoDB Collections

#### Users
```typescript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed),
  name: string,
  avatarUrl?: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### Events
```typescript
{
  _id: ObjectId,
  title: string,
  description?: string,
  location: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  city: string,
  state: string,
  address?: string,
  startTime: Date,
  endTime: Date,
  attendeeLimit: number,
  status: 'UPCOMING' | 'ONGOING' | 'ENDED' | 'CANCELLED',
  organizerId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

#### Attendances
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  eventId: ObjectId,
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'LEFT',
  puddingPhoto: string,
  puddingName?: string,
  puddingDesc?: string,
  joinedAt: Date,
  approvedAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Messages
```typescript
{
  _id: ObjectId,
  content: string,
  imageUrl?: string,
  userId: ObjectId,
  eventId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
HOST=localhost

# MongoDB
MONGODB_URI=mongodb://localhost:27017/pmitg
MONGODB_DATABASE=pmitg
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=5

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## 🛠️ Development Scripts

### Root Level
```bash
npm run dev              # Start both frontend and backend
npm run build            # Build all packages
npm run install:all      # Install dependencies for all packages
npm run clean            # Clean build artifacts
npm run lint             # Lint all packages
npm run type-check       # Type check all packages
```

### Frontend
```bash
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Backend
```bash
npm run dev              # Start with nodemon
npm run build            # Compile TypeScript
npm run start            # Start production server
npm run type-check       # Type check only
```

### Shared Package
```bash
npm run build            # Build TypeScript declarations
npm run dev              # Watch mode for development
```

## 🗺️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List events (with radius filtering)
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event details
- `PATCH /api/events/:id` - Update event (organizer only)
- `DELETE /api/events/:id` - Cancel event (organizer only)

### Attendances
- `POST /api/events/:eventId/join` - Join event with pudding photo
- `GET /api/events/:eventId/attendances` - Get attendees (organizer only)
- `PATCH /api/events/:eventId/attendances/:id` - Approve/reject attendance
- `DELETE /api/events/:eventId/attendance` - Leave event

### Messages
- `GET /api/events/:eventId/messages` - Get chat messages
- `POST /api/events/:eventId/messages` - Send message

## 🔌 WebSocket Events

### Client → Server
- `join_event` - Join event room for real-time updates
- `leave_event` - Leave event room
- `send_message` - Send chat message
- `typing` - Typing indicator

### Server → Client
- `new_message` - New chat message
- `attendance_approved` - User approved for event
- `event_updated` - Event details changed
- `user_typing` - Someone is typing
- `new_join_request` - New join request (organizer only)

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd apps/frontend
npm run build
# Deploy to Vercel via CLI or GitHub integration
```

### Backend (Railway/Render)
```bash
cd apps/backend
npm run build
# Set environment variables in platform dashboard
# Deploy via CLI or GitHub integration
```

### MongoDB
- **Development**: Local MongoDB
- **Production**: MongoDB Atlas or Railway MongoDB

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📁 Key Files

### Configuration
- `package.json` - Root workspace configuration
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variables template

### Backend
- `apps/backend/src/server.ts` - Main server file
- `apps/backend/src/config/database.ts` - MongoDB connection with retry logic
- `apps/backend/src/models/` - Mongoose models
- `apps/backend/src/middleware/` - Express middleware

### Frontend
- `apps/frontend/src/app/` - Next.js App Router pages
- `apps/frontend/src/components/` - React components
- `apps/frontend/tailwind.config.js` - TailwindCSS configuration

### Shared
- `packages/shared/src/index.ts` - All TypeScript interfaces

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running locally or check Atlas connection string
- Verify `MONGODB_URI` in `.env` file

**Port Already in Use**
- Change `PORT` in backend `.env` file
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`

**TypeScript Errors**
- Run `npm run type-check` to identify issues
- Ensure all packages are built: `npm run build`

**Module Not Found**
- Run `npm run install:all` to install all dependencies
- Check workspace configuration in root `package.json`

## 🎯 Roadmap

- [ ] Complete API endpoints implementation
- [ ] Add authentication middleware
- [ ] Implement file upload with image compression
- [ ] Add real-time chat functionality
- [ ] Create event creation flow
- [ ] Add user dashboard
- [ ] Implement push notifications
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production

---

**Happy pudding meetup organizing!** 🍮✨
