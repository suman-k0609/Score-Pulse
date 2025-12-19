# Sports Adda - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication Endpoints

### 1. User Registration
**Endpoint:** `POST /register`

**Request Body:**
```json
{
  "userName": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Error Response (400):**
```json
{
  "error": "User already exists"
}
```

---

### 2. User Login
**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid email or password"
}
```

---

## 🎯 Event Endpoints

### 3. Get All Events
**Endpoint:** `GET /events`

**Query Parameters:**
- `status` (optional): "upcoming", "live", "completed"
- `sport` (optional): "cricket", "basketball", "football", "tennis"

**Example:**
```
GET /events?sport=cricket&status=live
```

**Response (200):**
```json
{
  "message": "Events fetched successfully",
  "events": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "eventName": "India vs Pakistan",
      "sport": "cricket",
      "team1": {
        "name": "India",
        "score": 175
      },
      "team2": {
        "name": "Pakistan",
        "score": 142
      },
      "status": "live",
      "startTime": "2024-01-15T15:00:00Z",
      "venue": "Dubai",
      "description": "T20 Cricket Match",
      "eventHistory": [],
      "followersCount": 1245,
      "createdBy": {
        "_id": "507f1f77bcf86cd799439010",
        "userName": "admin"
      },
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T15:30:00Z"
    }
  ]
}
```

---

### 4. Get Event by ID
**Endpoint:** `GET /events/:eventId`

**Parameters:**
- `eventId` (required): Event ID from database

**Response (200):**
```json
{
  "message": "Event fetched successfully",
  "event": {
    "_id": "507f1f77bcf86cd799439011",
    "eventName": "India vs Pakistan",
    "sport": "cricket",
    "team1": {
      "name": "India",
      "score": 175
    },
    "team2": {
      "name": "Pakistan",
      "score": 142
    },
    "status": "live",
    "startTime": "2024-01-15T15:00:00Z",
    "venue": "Dubai",
    "description": "T20 Cricket Match",
    "eventHistory": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "timestamp": "2024-01-15T15:05:00Z",
        "action": "Boundary",
        "team": "India",
        "details": "5 points added"
      }
    ],
    "followersCount": 1245,
    "createdBy": {
      "_id": "507f1f77bcf86cd799439010",
      "userName": "admin",
      "email": "admin@sports.com"
    },
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T15:30:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Event not found"
}
```

---

### 5. Create Event
**Endpoint:** `POST /events`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "eventName": "India vs Australia",
  "sport": "cricket",
  "team1": "India",
  "team2": "Australia",
  "startTime": "2024-02-01T18:00:00Z",
  "venue": "MCG, Melbourne",
  "description": "ODI Cricket Match"
}
```

**Response (201):**
```json
{
  "message": "Event created successfully",
  "event": {
    "_id": "507f1f77bcf86cd799439015",
    "eventName": "India vs Australia",
    "sport": "cricket",
    "team1": {
      "name": "India",
      "score": 0
    },
    "team2": {
      "name": "Australia",
      "score": 0
    },
    "status": "upcoming",
    "startTime": "2024-02-01T18:00:00Z",
    "venue": "MCG, Melbourne",
    "description": "ODI Cricket Match",
    "eventHistory": [],
    "followersCount": 0,
    "createdBy": "507f1f77bcf86cd799439010",
    "createdAt": "2024-01-15T16:00:00Z",
    "updatedAt": "2024-01-15T16:00:00Z"
  }
}
```

---

### 6. Update Event Score
**Endpoint:** `PUT /events/:eventId/score`
**Auth Required:** ✅ Yes

**Parameters:**
- `eventId` (required): Event ID

**Request Body:**
```json
{
  "team": "team1",
  "points": 6,
  "action": "Six"
}
```

**Response (200):**
```json
{
  "message": "Score updated successfully",
  "event": {
    "_id": "507f1f77bcf86cd799439011",
    "team1": {
      "name": "India",
      "score": 181
    },
    "team2": {
      "name": "Pakistan",
      "score": 142
    },
    "eventHistory": [
      {
        "timestamp": "2024-01-15T15:35:00Z",
        "action": "Six",
        "team": "India",
        "details": "6 points added"
      }
    ]
  }
}
```

---

### 7. Update Event Status
**Endpoint:** `PUT /events/:eventId/status`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "status": "live"
}
```

**Valid Status Values:**
- "upcoming"
- "live"
- "completed"

**Response (200):**
```json
{
  "message": "Event status updated successfully",
  "event": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "live",
    "updatedAt": "2024-01-15T15:00:00Z"
  }
}
```

---

### 8. Add Event History/Commentary
**Endpoint:** `POST /events/:eventId/history`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "action": "Wicket",
  "team": "India",
  "details": "Batsman dismissed, bowled"
}
```

**Response (200):**
```json
{
  "message": "Event history added successfully",
  "event": {
    "_id": "507f1f77bcf86cd799439011",
    "eventHistory": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "timestamp": "2024-01-15T15:40:00Z",
        "action": "Wicket",
        "team": "India",
        "details": "Batsman dismissed, bowled"
      }
    ]
  }
}
```

---

## ❤️ Follow/Unfollow Endpoints

### 9. Follow Event
**Endpoint:** `POST /events/:eventId/follow`
**Auth Required:** ✅ Yes

**Response (201):**
```json
{
  "message": "Event followed successfully",
  "followedEvent": {
    "_id": "507f1f77bcf86cd799439025",
    "userId": "507f1f77bcf86cd799439010",
    "eventId": "507f1f77bcf86cd799439011",
    "followedAt": "2024-01-15T16:00:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Already following this event"
}
```

---

### 10. Unfollow Event
**Endpoint:** `DELETE /events/:eventId/follow`
**Auth Required:** ✅ Yes

**Response (200):**
```json
{
  "message": "Event unfollowed successfully"
}
```

---

### 11. Get User's Followed Events
**Endpoint:** `GET /events/user/followed-events`
**Auth Required:** ✅ Yes

**Response (200):**
```json
{
  "message": "Followed events fetched successfully",
  "events": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "eventName": "India vs Pakistan",
      "sport": "cricket",
      "team1": {
        "name": "India",
        "score": 175
      },
      "team2": {
        "name": "Pakistan",
        "score": 142
      },
      "status": "live",
      "startTime": "2024-01-15T15:00:00Z",
      "venue": "Dubai",
      "followersCount": 1245
    }
  ]
}
```

---

### 12. Check If Following Event
**Endpoint:** `GET /events/:eventId/is-following`
**Auth Required:** ✅ Yes

**Response (200):**
```json
{
  "isFollowing": true
}
```

---

## 📊 WebSocket Events

### Client → Server Events

**Join Event Room:**
```javascript
socket.emit('join_event', eventId);
```

**Leave Event Room:**
```javascript
socket.emit('leave_event', eventId);
```

### Server → Client Events

**Score Update:**
```javascript
socket.on('score_update', (data) => {
  console.log(data);
  // {
  //   eventId: "507f1f77bcf86cd799439011",
  //   team1: { name: "India", score: 181 },
  //   team2: { name: "Pakistan", score: 142 },
  //   eventHistory: [...]
  // }
});
```

**Event History Update:**
```javascript
socket.on('event_history_update', (data) => {
  console.log(data);
  // {
  //   eventId: "507f1f77bcf86cd799439011",
  //   eventHistory: [...]
  // }
});
```

**Event Status Update:**
```javascript
socket.on('event_status_update', (data) => {
  console.log(data);
  // {
  //   eventId: "507f1f77bcf86cd799439011",
  //   status: "live"
  // }
});
```

**Followers Update:**
```javascript
socket.on('followers_update', (data) => {
  console.log(data);
  // {
  //   eventId: "507f1f77bcf86cd799439011",
  //   followersCount: 1250
  // }
});
```

**New Event:**
```javascript
socket.on('new_event', (newEvent) => {
  console.log(newEvent);
  // { Full event object }
});
```

---

## 🔍 Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized no token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Event not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error message"
}
```

---

## 📋 Request/Response Examples

### Example 1: Complete User Flow

1. **Sign Up**
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

2. **Login**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

3. **Get All Events**
```bash
curl -X GET http://localhost:5000/api/events \
  -H "Authorization: Bearer <TOKEN>"
```

4. **Follow Event**
```bash
curl -X POST http://localhost:5000/api/events/EVENT_ID/follow \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 💡 Rate Limiting & Best Practices

- No built-in rate limiting yet (add in production)
- Keep API calls minimal on client side
- Use proper error handling
- Validate input data before sending
- Handle WebSocket disconnections gracefully
- Store JWT token securely (localStorage for now, use httpOnly cookies in production)

---

## 🔐 Security Notes

1. Never expose JWT tokens in URLs or logs
2. Always use HTTPS in production
3. Validate all input on server side
4. Use environment variables for sensitive data
5. Implement rate limiting for production
6. Add CSRF protection for state-changing operations
7. Keep dependencies updated

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Socket.IO Documentation](https://socket.io/docs)
- [JWT Authentication](https://jwt.io)

---

**API Version:** 1.0.0
**Last Updated:** December 18, 2025
