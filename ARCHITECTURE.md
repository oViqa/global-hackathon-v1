# 🏗️ System Architecture

Detailed technical architecture of the Pudding Gabel Meetup Platform.

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Next.js 14 Frontend                      │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │ │
│  │  │   Map    │  │  Events  │  │   Auth   │  │   Chat    │  │ │
│  │  │ (Leaflet)│  │ (Pages)  │  │ (Modals) │  │(Socket.io)│  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └───────────┘  │ │
│  │                                                              │ │
│  │  State Management: Zustand + React Context                  │ │
│  │  UI Library: TailwindCSS + shadcn/ui                        │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────┬──────────────────────────────────┬─────────────────┘
             │                                  │
             │ HTTPS (REST API)                 │ WSS (WebSocket)
             │                                  │
┌────────────▼──────────────────────────────────▼─────────────────┐
│                      Express.js Server                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     API Gateway Layer                       │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │ │
│  │  │    CORS     │  │  JWT Auth   │  │  Rate Limiting   │   │ │
│  │  └─────────────┘  └─────────────┘  └──────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     Route Handlers                          │ │
│  │  ┌──────────┐  ┌───────────┐  ┌────────────┐  ┌─────────┐ │ │
│  │  │   Auth   │  │  Events   │  │ Attendance │  │Messages │ │ │
│  │  │ /api/auth│  │/api/events│  │/api/attend │  │/api/msg │ │ │
│  │  └──────────┘  └───────────┘  └────────────┘  └─────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  Socket.io WebSocket Server                 │ │
│  │  - Event rooms (event:${eventId})                          │ │
│  │  - Real-time messaging                                      │ │
│  │  - Typing indicators                                        │ │
│  │  - Live notifications                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────┬─────────────────────┬──────────────────┬───────────┘
             │                     │                  │
             ▼                     ▼                  ▼
┌────────────────────┐  ┌─────────────────┐  ┌──────────────────┐
│   PostgreSQL 15    │  │ File Storage    │  │  External APIs   │
│   + Prisma ORM     │  │ (Local/S3)      │  │ (Future: Maps)   │
│                    │  │                 │  │                  │
│  ┌──────────────┐  │  │  - Pudding      │  │  - Geocoding     │
│  │    Tables    │  │  │    photos       │  │  - Email (SMTP)  │
│  │              │  │  │  - Avatars      │  │  - SMS (Twilio)  │
│  │  - users     │  │  │                 │  │                  │
│  │  - events    │  │  └─────────────────┘  └──────────────────┘
│  │  - attendance│  │
│  │  - messages  │  │
│  └──────────────┘  │
│                    │
│  ┌──────────────┐  │
│  │   Indexes    │  │
│  │              │  │
│  │  - location  │  │
│  │  - startTime │  │
│  │  - eventId   │  │
│  └──────────────┘  │
└────────────────────┘
```

## Component Architecture

### Frontend Components

```
src/
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page (map view)
│   └── globals.css          # Global styles
│
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── auth/
│   │   └── LoginDialog.tsx  # Login/Register modal
│   │
│   ├── events/
│   │   ├── CreateEventDialog.tsx
│   │   ├── EventDetailModal.tsx    # [Future]
│   │   └── EventCard.tsx           # [Future]
│   │
│   ├── map/
│   │   └── MapView.tsx      # Leaflet map component
│   │
│   └── chat/
│       └── ChatInterface.tsx # [Future]
│
├── lib/
│   ├── api.ts               # Axios instance + interceptors
│   └── utils.ts             # Helper functions
│
└── store/
    ├── authStore.ts         # Zustand auth state
    └── eventStore.ts        # [Future] Event state
```

### Backend Structure

```
src/
├── routes/
│   ├── auth.ts              # POST /register, /login, GET /me
│   ├── events.ts            # GET /events, /events/:id, POST /events
│   ├── attendance.ts        # POST /join, PATCH /approve, DELETE /leave
│   └── messages.ts          # GET /messages, POST /messages
│
├── middleware/
│   ├── auth.ts              # JWT verification
│   ├── upload.ts            # Multer configuration
│   └── errorHandler.ts      # Global error handler
│
├── utils/
│   └── geo.ts               # Distance calculation, Germany bounds
│
├── server.ts                # Express app + HTTP server
└── socket.ts                # Socket.io event handlers
```

## Data Flow Diagrams

### 1. User Registration Flow

```
User Browser                  Frontend                  Backend                Database
     │                           │                         │                      │
     │  Fill register form       │                         │                      │
     ├──────────────────────────>│                         │                      │
     │                           │  POST /api/auth/register│                      │
     │                           ├────────────────────────>│                      │
     │                           │                         │  Hash password       │
     │                           │                         │  (bcrypt)            │
     │                           │                         ├─────────────────────>│
     │                           │                         │  CREATE user         │
     │                           │                         │                      │
     │                           │                         │<─────────────────────┤
     │                           │  { user, token }        │  User created        │
     │                           │<────────────────────────┤                      │
     │  Store token in           │                         │                      │
     │  localStorage             │                         │                      │
     │<──────────────────────────┤                         │                      │
     │  Redirect to map          │                         │                      │
```

### 2. Event Discovery Flow

```
User Browser                  Frontend                  Backend                Database
     │                           │                         │                      │
     │  Load map page            │                         │                      │
     ├──────────────────────────>│                         │                      │
     │                           │  GET /api/events        │                      │
     │                           │  ?lat=52&lng=13         │                      │
     │                           │  &radius=20000          │                      │
     │                           ├────────────────────────>│                      │
     │                           │                         │  Calculate distance  │
     │                           │                         │  Filter by radius    │
     │                           │                         ├─────────────────────>│
     │                           │                         │  SELECT events       │
     │                           │                         │  JOIN attendances    │
     │                           │                         │<─────────────────────┤
     │                           │  { events: [...] }      │                      │
     │                           │<────────────────────────┤                      │
     │  Display markers on map   │                         │                      │
     │<──────────────────────────┤                         │                      │
```

### 3. Join Event Flow (with Photo Upload)

```
User Browser                  Frontend                  Backend                Database
     │                           │                         │                      │
     │  Click "Join Event"       │                         │                      │
     ├──────────────────────────>│                         │                      │
     │  Select pudding photo     │                         │                      │
     ├──────────────────────────>│                         │                      │
     │                           │  POST /api/attendance/  │                      │
     │                           │  events/:id/join        │                      │
     │                           │  (multipart/form-data)  │                      │
     │                           ├────────────────────────>│                      │
     │                           │                         │  Save file to disk   │
     │                           │                         │  (Multer)            │
     │                           │                         │                      │
     │                           │                         │  CREATE attendance   │
     │                           │                         │  status: PENDING     │
     │                           │                         ├─────────────────────>│
     │                           │                         │                      │
     │                           │                         │<─────────────────────┤
     │                           │  { attendance }         │  Attendance created  │
     │                           │<────────────────────────┤                      │
     │                           │                         │                      │
     │                           │  ╔═══════════════════╗  │                      │
     │                           │  ║ Socket.io Emit    ║  │                      │
     │                           │  ║ new_join_request  ║  │                      │
     │                           │  ╚═══════════════════╝  │                      │
     │                           │                         │                      │
     │  Show "Pending approval"  │                         │                      │
     │<──────────────────────────┤                         │                      │
     │                           │                         │                      │
     │                           │    (Organizer sees      │                      │
     │                           │     notification via    │                      │
     │                           │     WebSocket)          │                      │
```

### 4. Real-Time Chat Flow

```
User A (Browser)             Frontend                  Socket.io Server        Database
     │                           │                         │                      │
     │  Type message             │                         │                      │
     ├──────────────────────────>│                         │                      │
     │                           │  emit('send_message')   │                      │
     │                           ├────────────────────────>│                      │
     │                           │                         │  CREATE message      │
     │                           │                         ├─────────────────────>│
     │                           │                         │                      │
     │                           │                         │<─────────────────────┤
     │                           │                         │  Message saved       │
     │                           │                         │                      │
     │                           │  emit('new_message')    │                      │
     │                           │  to room: event:${id}   │                      │
     │                           │<────────────────────────┤                      │
     │  Display message          │         │               │                      │
     │<──────────────────────────┤         │               │                      │
     │                           │         │               │                      │
     │                           │         └──────────────>│  (User B receives    │
     │                           │           Broadcast to  │   same message       │
     │                           │           all in room   │   instantly)         │
```

## Database Schema (Prisma)

### Entity Relationship Diagram

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │──┐
│ email (unique)  │  │
│ passwordHash    │  │
│ name            │  │  1:N
│ avatarUrl       │  │
│ createdAt       │  │
└─────────────────┘  │
                     │
         ┌───────────┼───────────┐
         │           │           │
         │           │           │
         ▼           ▼           ▼
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│     Event       │ │   Attendance     │ │    Message      │
├─────────────────┤ ├──────────────────┤ ├─────────────────┤
│ id (PK)         │ │ id (PK)          │ │ id (PK)         │
│ title           │ │ userId (FK)──────┼─┤ userId (FK)     │
│ description     │ │ eventId (FK)────>│ │ eventId (FK)────┼──┐
│ locationLat     │<┼──────────────────┘ │ content         │  │
│ locationLng     │ │ status           │ │ imageUrl        │  │
│ city            │ │ puddingPhoto     │ │ createdAt       │  │
│ state           │ │ puddingName      │ └─────────────────┘  │
│ startTime       │ │ puddingDesc      │                      │
│ endTime         │ │ joinedAt         │                      │
│ attendeeLimit   │ │ approvedAt       │                      │
│ status          │ └──────────────────┘                      │
│ organizerId(FK) │                                           │
│ createdAt       │                                           │
│ updatedAt       │                                           │
└─────────────────┘                                           │
         │                                                    │
         └────────────────────────────────────────────────────┘
                           1:N
```

### Key Relationships

1. **User ↔ Event (1:N):** One user can organize many events
2. **User ↔ Attendance (1:N):** One user can join many events
3. **Event ↔ Attendance (1:N):** One event has many attendances
4. **User ↔ Message (1:N):** One user can send many messages
5. **Event ↔ Message (1:N):** One event has many messages

### Indexes for Performance

```sql
-- Event location queries (radius search)
CREATE INDEX idx_event_location ON events (location_lat, location_lng);

-- Event time filtering
CREATE INDEX idx_event_start_time ON events (start_time);

-- Message pagination
CREATE INDEX idx_message_event_created ON messages (event_id, created_at);

-- Unique constraint: user can only join event once
CREATE UNIQUE INDEX idx_attendance_user_event ON attendances (user_id, event_id);
```

## API Endpoints

### Authentication
```
POST   /api/auth/register     - Create new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user (protected)
```

### Events
```
GET    /api/events            - List events (with filters)
GET    /api/events/:id        - Get event details
POST   /api/events            - Create event (protected)
PATCH  /api/events/:id        - Update event (protected, organizer only)
DELETE /api/events/:id        - Cancel event (protected, organizer only)
```

### Attendance
```
POST   /api/attendance/events/:id/join              - Join event (protected)
GET    /api/attendance/events/:id/attendances       - Get attendances (protected, organizer)
PATCH  /api/attendance/events/:id/attendances/:aid  - Approve/reject (protected, organizer)
DELETE /api/attendance/events/:id/attendance        - Leave event (protected)
```

### Messages
```
GET    /api/messages/events/:id/messages  - Get messages (protected, approved only)
POST   /api/messages/events/:id/messages  - Send message (protected, approved only)
```

### WebSocket Events
```
Client → Server:
  - join_event({ eventId })
  - send_message({ eventId, content, imageUrl })
  - typing({ eventId, isTyping })

Server → Client:
  - new_message(message)
  - attendance_approved({ eventId, userId })
  - event_updated(event)
  - user_typing({ userId, name, isTyping })
  - new_join_request(attendance)
```

## Security Architecture

### Authentication Flow
```
1. User registers/logs in
2. Backend generates JWT token (expires in 7 days)
3. Frontend stores token in localStorage
4. Every API request includes: Authorization: Bearer <token>
5. Backend middleware verifies token
6. If valid: attach userId to request
7. If invalid: return 401 Unauthorized
```

### Authorization Layers
```
1. Public: Anyone can view events
2. Authenticated: Can create events, join events
3. Organizer: Can approve/reject, edit/delete own events
4. Approved Attendee: Can access chat for specific event
```

### Data Protection
```
- Passwords: bcrypt with 10 salt rounds
- Tokens: JWT with secret key (256-bit)
- File Uploads: Size limit (5MB), type validation (images only)
- Rate Limiting: Max requests per IP per time window
- CORS: Only allow specific origin (frontend URL)
- Input Validation: Zod schemas on all endpoints
- SQL Injection: Prevented by Prisma (parameterized queries)
- XSS: React auto-escapes, no dangerouslySetInnerHTML
```

## Scalability Considerations

### Current Capacity
- **Users:** ~1,000 concurrent
- **Events:** ~10,000 total
- **Messages:** ~100,000 total
- **File Storage:** ~10GB

### Bottlenecks & Solutions

**1. Database Queries**
- Problem: Slow radius searches as data grows
- Solution: PostGIS extension, spatial indexes
- Future: Read replicas, query caching (Redis)

**2. File Storage**
- Problem: Local disk fills up
- Solution: Migrate to S3/Cloudinary
- Future: CDN for fast global delivery

**3. WebSocket Connections**
- Problem: Single server can't handle many connections
- Solution: Socket.io Redis adapter
- Future: Multiple backend instances + load balancer

**4. API Response Time**
- Problem: Complex joins slow down
- Solution: Database indexes, query optimization
- Future: GraphQL for flexible queries, caching layer

### Horizontal Scaling Path

```
Current (Single Server):
┌────────────┐
│  Backend   │
│  (Express) │
└────────────┘
      │
      ▼
┌────────────┐
│ PostgreSQL │
└────────────┘

Future (Scaled):
                     ┌────────────┐
                ┌───>│ Backend 1  │───┐
                │    └────────────┘   │
┌─────────────┐ │    ┌────────────┐   │   ┌────────────┐
│ Load        │─┼───>│ Backend 2  │───┼──>│   Redis    │
│ Balancer    │ │    └────────────┘   │   │  (Cache +  │
└─────────────┘ │    ┌────────────┐   │   │  Sessions) │
                └───>│ Backend 3  │───┘   └────────────┘
                     └────────────┘             │
                            │                   │
                            ▼                   ▼
                     ┌────────────┐      ┌────────────┐
                     │PostgreSQL  │      │   CDN      │
                     │  (Primary) │      │  (Images)  │
                     └────────────┘      └────────────┘
                            │
                            ▼
                     ┌────────────┐
                     │PostgreSQL  │
                     │  (Replica) │
                     └────────────┘
```

## Monitoring & Observability

### Metrics to Track
- API response times (p50, p95, p99)
- Error rates by endpoint
- Database query performance
- WebSocket connection count
- File upload success rate
- User registration conversion

### Logging Strategy
```typescript
// Structured logging
logger.info('Event created', {
  eventId: event.id,
  userId: user.id,
  city: event.city,
  timestamp: new Date()
});
```

### Health Checks
```
GET /health → { status: 'ok', timestamp: '...' }
GET /health/db → Test database connection
GET /health/storage → Test file system
```

---

This architecture supports the MVP and can scale to millions of users with the outlined optimizations.
