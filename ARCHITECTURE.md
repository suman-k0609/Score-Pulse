# Sports Adda - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INTERNET / USERS                             │
└────────────────────────┬────────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
  ┌─────────────────┐           ┌──────────────────────┐
  │ FRONTEND (3000) │           │  BACKEND (5000)      │
  │ React 18 + UI   │◄──HTTP────┤  Express.js + Node   │
  │ - Login Page    │           │  - User Auth         │
  │ - Dashboard     │           │  - Event CRUD        │
  │ - Scoreboard    │           │  - Event History     │
  │ - Components    │◄─WebSocket┤  - Follow System     │
  │ - Services      │─WebSocket─┤  - WebSockets        │
  └─────────────────┘           │  - Middleware        │
        │                       │  - Routes            │
        │                       └────────┬─────────────┘
        │                                │
        │          ┌──────────────────────┘
        │          ▼
        │     ┌──────────────────┐
        │     │    MongoDB       │
        │     │  (Mongoose ODM)  │
        │     │                  │
        │     │ Collections:     │
        │     │ - users          │
        │     │ - events         │
        │     │ - followedevents │
        │     └──────────────────┘
        │
        └─ Socket.IO (Real-time)
           - join_event
           - leave_event
           - score_update
           - history_update
           - followers_update
```

---

## Request/Response Flow

### Authentication Flow
```
User Signup/Login
        │
        ▼
┌─────────────────┐
│ Frontend Form   │ (username, email, password)
└────────┬────────┘
         │
         ▼ HTTP POST
┌─────────────────┐
│ Backend Routes  │ (/register, /login)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User Controller │ (Hash password, Create JWT)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Database        │ (Store user)
└────────┬────────┘
         │
         ▼ JWT Token
┌─────────────────┐
│ Frontend Auth   │ (Store in localStorage)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Dashboard       │ (Redirect to dashboard)
└─────────────────┘
```

### Event View & Real-time Updates
```
┌──────────────────────┐
│ User View Dashboard  │
└──────────┬───────────┘
           │
           ▼ HTTP GET
┌──────────────────────┐
│ Get All Events       │ (/events)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Database Query       │ (MongoDB find)
└──────────┬───────────┘
           │
           ▼ Events List
┌──────────────────────┐
│ Display Event Cards  │
└──────────┬───────────┘
           │
           ▼ Click Event
┌──────────────────────┐
│ Event Detail Page    │ (/event/:id)
└──────────┬───────────┘
           │
           ▼ WebSocket
┌──────────────────────┐
│ Join Event Room      │ (join_event)
└──────────┬───────────┘
           │
           ├─────────────────────────────────┐
           │ Listen for Real-time Updates     │
           │                                 │
           │ ▼ WebSocket                    ▼ WebSocket
           │ score_update              event_history_update
           │ followers_update          event_status_update
           │                                 │
           ├─────────────────────────────────┘
           │
           ▼
┌──────────────────────┐
│ Update UI State      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Re-render Component  │ (Live Score Display)
└──────────────────────┘
```

---

## Data Flow for Follow System

```
┌──────────────────────┐
│ User Clicks Follow   │
└──────────┬───────────┘
           │
           ▼ HTTP POST
┌──────────────────────────┐
│ /api/events/:id/follow   │
└──────────┬───────────────┘
           │ (Auth Middleware)
           ▼
┌──────────────────────────┐
│ Event Controller         │
│ - Check if already follow│
│ - Create FollowedEvent   │
│ - Increment followers    │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Database Transactions    │
│ 1. Create follow record  │
│ 2. Update event count    │
└──────────┬───────────────┘
           │
           ▼ WebSocket
┌──────────────────────────┐
│ Broadcast followers_update
└──────────┬───────────────┘
           │
           ├─────────────────────┐
           │                     │
           ▼                     ▼
┌──────────────────┐      ┌──────────────────┐
│ User 1 Receives  │      │ User 2 Receives  │
│ followers: 1246  │      │ followers: 1246  │
└──────────────────┘      └──────────────────┘
```

---

## WebSocket Real-time Architecture

```
┌─────────────────────────────────────┐
│         Socket.IO Server            │
│      (Backend on Port 5000)          │
├─────────────────────────────────────┤
│                                     │
│  Event Rooms:                       │
│  ┌─ event_507f1f77bcf86cd79943... │
│  │   ├─ Client 1 (Web Browser)     │
│  │   ├─ Client 2 (Mobile)          │
│  │   ├─ Client 3 (Desktop)         │
│  │   └─ Admin (Event Updates)      │
│  │                                  │
│  └─ event_507f1f77bcf86cd79944... │
│     ├─ Client 4                    │
│     └─ Client 5                    │
│                                     │
│  Broadcasting:                      │
│  io.to('event_ID').emit(...)       │
│                                     │
└─────────────────────────────────────┘
        ▲         │         │
        │         │         │
   JOIN │     UPDATE│    LEAVE
        │         │         │
        │         ▼         ▼
   ┌────────────────────────────────┐
   │ All Connected Clients          │
   │ Receive Real-time Updates      │
   │ Simultaneously                 │
   └────────────────────────────────┘
```

---

## Frontend Component Tree

```
App.js
├── AuthProvider (Context)
│   ├── LoginPage
│   │   ├── LoginForm
│   │   └── Link to Signup
│   │
│   ├── SignupPage
│   │   ├── SignupForm
│   │   └── Link to Login
│   │
│   ├── ProtectedRoute
│   │   ├── Dashboard
│   │   │   ├── Navbar
│   │   │   ├── EventList
│   │   │   │   └── EventCard[] (Grid)
│   │   │   │       ├── Score Display
│   │   │   │       ├── Follow Button
│   │   │   │       └── Event Info
│   │   │   │
│   │   │   └── Filters
│   │   │       ├── Sport Filter
│   │   │       └── Status Filter
│   │   │
│   │   └── EventDetailPage
│   │       ├── Navbar
│   │       ├── Live Scoreboard
│   │       │   ├── Score Display
│   │       │   └── Follow Button
│   │       │
│   │       ├── Event Timeline
│   │       │   └── History Items[]
│   │       │
│   │       └── Event Details Sidebar
│   │           ├── Status
│   │           ├── Venue
│   │           └── Followers
│   │
│   └── NotFound
│       └── Error Message
│
└── ToastContainer
    └── Notifications
```

---

## Database Schema Relationships

```
┌──────────────┐
│    Users     │
├──────────────┤
│ _id (PK)     │
│ userName     │
│ email        │
│ password     │
│ createdAt    │
└────────┬─────┘
         │ 1:N
         │
         ├────────────┐
         │            │
         │            ▼
         │      ┌──────────────────┐
         │      │ FollowedEvents   │
         │      ├──────────────────┤
         │      │ _id (PK)         │
         │      │ userId (FK)      │
         │      │ eventId (FK)     │
         │      │ followedAt       │
         │      └────────┬─────────┘
         │               │
         │               │
         ▼               ▼
    ┌────────────────────────────┐
    │       Events               │
    ├────────────────────────────┤
    │ _id (PK)                   │
    │ eventName                  │
    │ sport                      │
    │ team1 (name, score)        │
    │ team2 (name, score)        │
    │ status                     │
    │ startTime                  │
    │ venue                      │
    │ createdBy (FK to Users)    │
    │ eventHistory[]             │
    │ followersCount             │
    │ createdAt / updatedAt      │
    └────────────────────────────┘
```

---

## API & WebSocket Event Flow

### API Calls (REST)
```
Frontend                Backend                Database
   │                      │                        │
   ├─ POST /register ────▶│ Hash Password          │
   │                      ├─────────────────────▶  │
   │                      │ Create User            │
   │                      │◀──────────────────────┤
   │◀─ JWT Token ────────┤                        │
   │                      │                        │
   ├─ POST /login ───────▶│ Verify Password        │
   │                      ├─────────────────────▶  │
   │                      │ Find User              │
   │                      │◀──────────────────────┤
   │◀─ JWT Token ────────┤                        │
   │                      │                        │
   ├─ GET /events ───────▶│ Query Events           │
   │                      ├─────────────────────▶  │
   │                      │ Filter & Sort          │
   │                      │◀──────────────────────┤
   │◀─ Events List ──────┤                        │
   │                      │                        │
   ├─ POST /follow ──────▶│ Check Already Follow   │
   │                      ├─────────────────────▶  │
   │                      │ Create Record          │
   │                      │ Update Count           │
   │                      │◀──────────────────────┤
   │◀─ Success ─────────┤                        │
```

### WebSocket Events (Real-time)
```
Frontend (Listener)      Backend (Broadcaster)      Other Clients
   │                            │                          │
   ├─ join_event ──────────────▶│                          │
   │                            │◀─ join_event ───────────┤
   │                            │                          │
   │                            │ (Event Score Update)     │
   │◀─ score_update ────────────│                          │
   │                            │ (Broadcast to all)       │
   │                            ├─ score_update ─────────▶│
   │                            │                          │
   │◀─ event_history_update ────│                          │
   │                            │ (Broadcast to all)       │
   │                            ├─ event_history ────────▶│
   │                            │                          │
   │◀─ followers_update ────────│                          │
   │                            │ (Broadcast to all)       │
   │                            ├─ followers_update ─────▶│
   │                            │                          │
   ├─ leave_event ─────────────▶│                          │
   │                            │ (Stop receiving)        │
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│               Production Environment                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐      ┌──────────────────┐   │
│  │   Vercel/Netlify │      │  Heroku/Railway  │   │
│  │  (Frontend)      │      │  (Backend)       │   │
│  │  React 18 Build  │      │  Node.js Server  │   │
│  └────────┬─────────┘      └────────┬─────────┘   │
│           │                         │             │
│           │ CDN                     │ API         │
│           │ https://domain.com      │ https://api │
│           │                         │             │
│           └──────────────┬──────────┘             │
│                          │                        │
│                          ▼                        │
│           ┌─────────────────────────┐            │
│           │   MongoDB Atlas Cloud   │            │
│           │   (Managed Database)    │            │
│           │   Cluster Database      │            │
│           │   Backups & Monitoring  │            │
│           └─────────────────────────┘            │
│                          │                        │
│           ┌──────────────┴──────────────┐        │
│           │                             │         │
│           ▼                             ▼         │
│    ┌────────────────┐          ┌────────────────┐│
│    │   Analytics    │          │   Monitoring   ││
│    │   (New Relic)  │          │   (DataDog)    ││
│    └────────────────┘          └────────────────┘│
│                                                   │
└─────────────────────────────────────────────────────┘
```

---

## Development Workflow

```
Developer
   │
   ├─ Code Changes
   │
   └─ Git Push
      │
      ├─ GitHub/GitLab
      │  │
      │  ├─ CI/CD Pipeline
      │  │  ├─ Run Tests
      │  │  ├─ Lint Code
      │  │  ├─ Build
      │  │  └─ Check Quality
      │  │
      │  ├─ Auto Deploy Frontend
      │  │  └─ Vercel/Netlify
      │  │     └─ Live Update
      │  │
      │  └─ Auto Deploy Backend
      │     └─ Heroku/Railway
      │        └─ Live Update
      │
      └─ User sees changes
         in real-time
```

---

## Scalability Considerations

```
Current Setup (Development)
├─ Single server instance
├─ Local database
└─ Basic WebSocket

Scale to Production
├─ Load Balancer (nginx/HAProxy)
│  ├─ Multiple backend instances
│  ├─ Auto-scaling
│  └─ Health checks
│
├─ Database
│  ├─ MongoDB Cluster
│  ├─ Replication
│  ├─ Sharding
│  └─ Backups
│
├─ Caching Layer (Redis)
│  ├─ Session storage
│  ├─ Rate limiting
│  └─ Real-time data cache
│
├─ WebSocket
│  ├─ Redis Adapter
│  ├─ Multiple rooms
│  └─ Client distribution
│
└─ CDN
   ├─ Static assets
   ├─ Image optimization
   └─ Global distribution
```

---

**Diagram Last Updated:** December 18, 2025
