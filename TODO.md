# ✅ TODO List

High-priority tasks to complete the MVP.

## 🔥 Critical (Must Complete for Demo)

### Frontend Components

#### 1. Event Detail Modal
**File:** `frontend/src/components/events/EventDetailModal.tsx`

- [ ] Create full-screen modal for event details
- [ ] Display event info (title, description, location, time)
- [ ] Show countdown timer ("Starts in X hours")
- [ ] Display attendee count (8/15 joined)
- [ ] Show pudding photo grid (mosaic of attendees)
- [ ] Organizer info section
- [ ] Primary CTA button based on status:
  - Not joined: "Join Event"
  - Pending: "Waiting for approval" (disabled)
  - Approved: "Open Chat" + "Leave Event"
  - Full: "Event Full" (disabled)

#### 2. Join Event Dialog
**File:** `frontend/src/components/events/JoinEventDialog.tsx`

- [ ] Photo upload area (drag & drop or click)
- [ ] Use react-dropzone for file handling
- [ ] Image preview after upload
- [ ] Compress image with browser-image-compression
- [ ] Optional pudding name input
- [ ] Optional description textarea
- [ ] Submit button (disabled until photo uploaded)
- [ ] Send multipart/form-data to POST /api/attendance/events/:id/join
- [ ] Show success toast "Request sent!"
- [ ] Handle errors gracefully

#### 3. Organizer Dashboard
**File:** `frontend/src/components/events/OrganizerDashboard.tsx`

- [ ] Fetch pending attendances: GET /api/attendance/events/:id/attendances
- [ ] Display as cards/list
- [ ] Show user name, join time
- [ ] Large pudding photo preview
- [ ] Pudding name/description
- [ ] Approve button (green)
- [ ] Reject button (red)
- [ ] Send PATCH to approve/reject endpoint
- [ ] Socket.io listener for new join requests
- [ ] Show notification badge for pending count
- [ ] Approved attendees list below

#### 4. Chat Interface
**File:** `frontend/src/components/chat/ChatWindow.tsx`

- [ ] Socket.io client setup
- [ ] Connect to server with JWT token
- [ ] Join event room: `socket.emit('join_event', { eventId })`
- [ ] Message list (scrollable)
- [ ] Message bubbles (left for others, right for user)
- [ ] User avatars (initials if no photo)
- [ ] Timestamps
- [ ] Message input field (bottom fixed)
- [ ] Send button
- [ ] Emit message: `socket.emit('send_message', { eventId, content })`
- [ ] Listen for messages: `socket.on('new_message', ...)`
- [ ] Auto-scroll to latest message
- [ ] Typing indicator: `socket.emit('typing', { eventId, isTyping })`
- [ ] Show "X is typing..." indicator

### Integration Tasks

#### 5. Wire Up All Components
**File:** `frontend/src/app/page.tsx` and `frontend/src/components/map/MapView.tsx`

- [ ] Connect EventDetailModal to map markers
- [ ] Pass event data to modal
- [ ] Show JoinEventDialog when "Join Event" clicked
- [ ] Check authentication before showing join dialog
- [ ] Show OrganizerDashboard if user is organizer
- [ ] Open ChatWindow if user is approved attendee
- [ ] Handle all state transitions

#### 6. Socket.io Client Setup
**File:** `frontend/src/lib/socket.ts`

- [ ] Create Socket.io client instance
- [ ] Connect with JWT token from localStorage
- [ ] Handle connection/disconnection
- [ ] Export socket instance for use in components
- [ ] Add error handling

### Utilities

#### 7. Image Handling
**File:** `frontend/src/lib/imageUtils.ts`

- [ ] Function to compress image before upload
- [ ] Max file size: 1MB
- [ ] Convert to WebP if possible
- [ ] Maintain aspect ratio
- [ ] Show compression progress

## 🎨 Polish (Nice to Have)

### UI Improvements
- [ ] Loading skeletons for map markers
- [ ] Smooth transitions between modals
- [ ] Animated pudding emoji on success
- [ ] Better empty states
- [ ] Hover effects on markers
- [ ] Pulsing animation for events starting soon

### Functionality
- [ ] Radius filter dropdown
- [ ] Time filter buttons
- [ ] List view toggle
- [ ] Search events by city
- [ ] User location detection
- [ ] Event distance sorting

### Mobile
- [ ] Touch-friendly button sizes (min 44px)
- [ ] Swipe to close modals
- [ ] Bottom sheet style modals on mobile
- [ ] Optimize map for touch

## 🧪 Testing

### Manual Testing Checklist
- [ ] Register new account
- [ ] Login with existing account
- [ ] Create event
- [ ] Join event with photo upload
- [ ] Approve as organizer
- [ ] Send messages in chat
- [ ] Real-time updates work
- [ ] Logout and login again
- [ ] Test on mobile browser
- [ ] Test on different browsers (Chrome, Firefox, Safari)

### Edge Cases
- [ ] What if image upload fails?
- [ ] What if event is full?
- [ ] What if organizer rejects?
- [ ] What if socket disconnects?
- [ ] What if JWT expires?

## 🚀 Deployment

### Pre-Deployment
- [ ] Test production build locally: `npm run build`
- [ ] Check all environment variables set correctly
- [ ] Verify no console errors
- [ ] Test on mobile viewport
- [ ] Ensure no API keys in frontend code

### Backend Deployment (Railway)
- [ ] Create Railway account
- [ ] Create new project
- [ ] Add PostgreSQL database
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Set environment variables
- [ ] Deploy
- [ ] Run migrations: `railway run npx prisma migrate deploy`
- [ ] Seed database: `railway run npm run seed`
- [ ] Test API endpoints

### Frontend Deployment (Vercel)
- [ ] Push code to GitHub
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Add environment variables:
  - NEXT_PUBLIC_API_URL
  - NEXT_PUBLIC_WS_URL
- [ ] Deploy
- [ ] Test in production
- [ ] Check WebSocket connection works

### Post-Deployment
- [ ] Test entire user flow in production
- [ ] Verify Socket.io works with wss://
- [ ] Check CORS settings
- [ ] Monitor for errors
- [ ] Get production URL for demo video

## 🎬 Demo Video

### Recording
- [ ] Write demo script (see DEMO_SCRIPT.md)
- [ ] Practice run-through
- [ ] Clear browser cache
- [ ] Close unnecessary tabs
- [ ] Set browser zoom to 100%
- [ ] Have pudding photo ready
- [ ] Record in 1080p
- [ ] Record multiple takes

### Editing
- [ ] Cut to 60 seconds
- [ ] Add background music
- [ ] Add text overlays for key features
- [ ] Add website URL on screen
- [ ] Export as MP4
- [ ] Upload to YouTube/Loom
- [ ] Make public/unlisted
- [ ] Get shareable link

## 📤 Hackathon Submission

### Required Materials
- [ ] GitHub repository URL (public)
- [ ] Live demo URL (production)
- [ ] 60-second demo video URL
- [ ] Email and name
- [ ] Project description (max 500 chars)

### Before Submitting
- [ ] Run `node verify-submission.js`
- [ ] Verify repo is public
- [ ] Test demo URL in incognito window
- [ ] Ensure video is accessible
- [ ] Check 5+ git commits made
- [ ] README updated with project info

### Submission Form
- [ ] Go to https://forms.acta.so/r/wMobdM
- [ ] Fill in all fields
- [ ] Double-check URLs work
- [ ] Submit before deadline (Oct 5, 12:00 CET)
- [ ] Save confirmation email

## 📊 Progress Tracking

Update this as you complete tasks:

```
Critical Tasks:     ▓▓▓▓▓▓▓░░░ 4/7 (57%)
Polish Tasks:       ░░░░░░░░░░ 0/15 (0%)
Testing:            ░░░░░░░░░░ 0/10 (0%)
Deployment:         ░░░░░░░░░░ 0/15 (0%)
Demo Video:         ░░░░░░░░░░ 0/10 (0%)
Submission:         ░░░░░░░░░░ 0/8 (0%)
```

---

**Estimated Time Remaining: 8-12 hours**

Focus on Critical Tasks first, then polish if time allows! 🚀
