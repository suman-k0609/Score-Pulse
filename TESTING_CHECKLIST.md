# Sports Adda - Testing Checklist

## 🧪 Comprehensive Testing Checklist

Use this checklist to thoroughly test the application before deployment.

---

## Phase 1: Backend Testing

### Setup & Configuration
- [ ] MongoDB connection successful
- [ ] Backend server starts without errors
- [ ] Port 5000 accessible
- [ ] CORS configured correctly
- [ ] Environment variables loaded
- [ ] Socket.IO server initialized

### Authentication Endpoints

#### Registration (`POST /api/register`)
- [ ] Register with valid data → Success (201)
- [ ] Verify JWT token returned
- [ ] Verify user created in database
- [ ] Register with duplicate email → Error (400)
- [ ] Register with weak password → Success (should fail in production)
- [ ] Register with missing fields → Error (400)
- [ ] Verify password hashed in database
- [ ] Verify user email is unique

#### Login (`POST /api/login`)
- [ ] Login with correct email/password → Success (200)
- [ ] Verify JWT token returned
- [ ] Verify token works for protected routes
- [ ] Login with wrong password → Error (400)
- [ ] Login with non-existent email → Error (400)
- [ ] Login with missing fields → Error (400)
- [ ] Verify token expires after set time

### Event Endpoints

#### Get All Events (`GET /api/events`)
- [ ] Get events without filters → All events returned
- [ ] Get events with sport filter → Only that sport
- [ ] Get events with status filter → Only that status
- [ ] Get events with both filters → Correct combination
- [ ] Get events without auth token → Works (public)
- [ ] Response includes all required fields
- [ ] Large event list loads without errors

#### Get Event by ID (`GET /api/events/:eventId`)
- [ ] Get valid event → Event details returned (200)
- [ ] Get with invalid ID → Error (404)
- [ ] Get with non-existent ID → Error (404)
- [ ] Response includes event history array
- [ ] Response includes follower count

#### Create Event (`POST /api/events`)
- [ ] Create with valid data → Event created (201)
- [ ] Verify createdBy set to current user
- [ ] Verify initial score is 0
- [ ] Verify status defaults to "upcoming"
- [ ] Create without auth token → Error (401)
- [ ] Create with missing fields → Error (400)
- [ ] Verify event visible in "Get All" endpoint

#### Update Score (`PUT /api/events/:eventId/score`)
- [ ] Update team1 score → Score updated
- [ ] Update team2 score → Score updated
- [ ] Verify event history added
- [ ] Verify timestamp recorded
- [ ] Update with invalid team → Error (400)
- [ ] Update without auth → Error (401)
- [ ] Multiple score updates → All recorded

#### Update Status (`PUT /api/events/:eventId/status`)
- [ ] Change to "live" → Status updated
- [ ] Change to "completed" → Status updated
- [ ] Change back to "upcoming" → Status updated
- [ ] Invalid status value → Error (400)
- [ ] Without auth → Error (401)
- [ ] Non-existent event → Error (404)

#### Add Event History (`POST /api/events/:eventId/history`)
- [ ] Add valid history → Added successfully
- [ ] Verify timestamp recorded
- [ ] Verify team recorded
- [ ] Verify action recorded
- [ ] Verify details recorded
- [ ] History appears in event details
- [ ] Without auth → Error (401)

### Follow/Unfollow Endpoints

#### Follow Event (`POST /api/events/:eventId/follow`)
- [ ] Follow valid event → Record created (201)
- [ ] Verify FollowedEvent record in DB
- [ ] Verify followers count incremented
- [ ] Follow already followed event → Error (400)
- [ ] Follow without auth → Error (401)
- [ ] Follow non-existent event → Error (404)

#### Unfollow Event (`DELETE /api/events/:eventId/follow`)
- [ ] Unfollow followed event → Success (200)
- [ ] Verify FollowedEvent record deleted
- [ ] Verify followers count decremented
- [ ] Unfollow non-followed event → Error (404)
- [ ] Unfollow without auth → Error (401)

#### Get User's Followed Events (`GET /api/events/user/followed-events`)
- [ ] Get followed events → Returns correct events
- [ ] Only returns events user follows
- [ ] Without auth → Error (401)
- [ ] No followed events → Empty array

#### Check Follow Status (`GET /api/events/:eventId/is-following`)
- [ ] Check followed event → Returns true
- [ ] Check non-followed event → Returns false
- [ ] Non-existent event → Error (404)
- [ ] Without auth → Error (401)

---

## Phase 2: Frontend Testing

### Initial Setup
- [ ] npm install completes without errors
- [ ] Development server starts on port 3000
- [ ] No console errors on load
- [ ] Environment variables loaded
- [ ] Tailwind CSS styling applied

### Authentication Pages

#### Login Page (`/login`)
- [ ] Page loads correctly
- [ ] Email input accepts valid email
- [ ] Password input hides password
- [ ] Password visibility toggle works
- [ ] Form submits with valid data
- [ ] Success → Redirect to dashboard
- [ ] Wrong credentials → Error message
- [ ] Network error → Error toast
- [ ] Link to signup works
- [ ] Mobile responsive layout

#### Signup Page (`/signup`)
- [ ] Page loads correctly
- [ ] All form fields visible
- [ ] Username validation (min 3 chars)
- [ ] Email validation
- [ ] Password validation (min 6 chars)
- [ ] Confirm password match validation
- [ ] Form submits with valid data
- [ ] Success → Redirect to dashboard
- [ ] Duplicate email → Error message
- [ ] Link to login works
- [ ] Mobile responsive layout

### Protected Routes
- [ ] Logged out user can't access dashboard
- [ ] Redirect to login works
- [ ] Logged in user can access dashboard
- [ ] Token expires → Redirect to login
- [ ] Refresh page → Still logged in

### Dashboard Page

#### Page Layout
- [ ] Navbar displays correctly
- [ ] User email shown in navbar
- [ ] Logout button visible
- [ ] Page title and description visible
- [ ] Filter section visible
- [ ] Event grid visible

#### Tab System
- [ ] "All Events" tab visible
- [ ] "Following" tab visible
- [ ] Tab count shows correct numbers
- [ ] Switch between tabs works
- [ ] Tab content updates correctly

#### Filters
- [ ] Sport dropdown has all sports
- [ ] Status dropdown has all statuses
- [ ] Filter by sport works
- [ ] Filter by status works
- [ ] Combine filters works
- [ ] Clear filters button appears
- [ ] Clear filters works

#### Event Cards
- [ ] Event name displayed
- [ ] Sport badge displayed
- [ ] Status badge with correct color
- [ ] Status badge animates if live
- [ ] Team names visible
- [ ] Scores visible
- [ ] Venue visible
- [ ] Followers count visible
- [ ] Follow button visible
- [ ] Follow button clickable
- [ ] Card click opens event detail

#### Real-time Features
- [ ] New event notification appears
- [ ] Following tab updates when followed
- [ ] Followers count updates in real-time
- [ ] Multiple windows sync in real-time

#### Mobile Responsive
- [ ] Mobile: Single column layout
- [ ] Tablet: Two column layout
- [ ] Desktop: Three column layout
- [ ] No overflow or horizontal scroll
- [ ] Touch-friendly button sizes

### Event Detail Page

#### Page Layout
- [ ] Back button visible and works
- [ ] Event name displayed
- [ ] Event status badge visible
- [ ] Follow button visible
- [ ] Sports type visible
- [ ] Date/time visible
- [ ] Venue visible
- [ ] Followers count visible

#### Live Scoreboard
- [ ] Team 1 name visible
- [ ] Team 1 score large and visible
- [ ] Team 2 name visible
- [ ] Team 2 score large and visible
- [ ] "vs" separator visible
- [ ] Score updates in real-time
- [ ] Score animations smooth

#### Event Timeline
- [ ] Timeline section visible
- [ ] History items display
- [ ] Timestamps show correctly
- [ ] Team names shown
- [ ] Actions shown
- [ ] Details shown
- [ ] Timeline updates in real-time
- [ ] Timeline scrollable if many items

#### Event Details Sidebar
- [ ] Status displayed
- [ ] Sport displayed
- [ ] Created by displayed
- [ ] Last updated timestamp
- [ ] Followers count
- [ ] All info visible on mobile

#### Follow Functionality
- [ ] Follow button changes color when followed
- [ ] Text changes from "Follow" to "Following"
- [ ] Success toast shows
- [ ] Button state updates
- [ ] Switch between follow/unfollow works
- [ ] Error handles gracefully

#### WebSocket Updates
- [ ] Score updates appear live
- [ ] History updates appear live
- [ ] Status updates appear live
- [ ] Follower count updates live
- [ ] Multiple connections sync

### Navbar Component
- [ ] Logo clickable → Go to dashboard
- [ ] User email displayed
- [ ] Logout button functional
- [ ] Mobile menu toggle works
- [ ] Mobile menu items clickable
- [ ] Responsive design works
- [ ] No mobile overlap issues

### Error Handling
- [ ] Invalid routes → 404 page
- [ ] 404 page has back button
- [ ] Back button works
- [ ] Network errors → Toast message
- [ ] API errors → Toast message
- [ ] Form validation errors shown
- [ ] No unhandled console errors

### Loading States
- [ ] Loading spinner appears while fetching
- [ ] Spinner appears while authenticating
- [ ] Loading text displayed
- [ ] Can't interact during loading
- [ ] Spinner disappears when done

### Styling & UI

#### Theme
- [ ] Dark theme applied
- [ ] Gradient colors visible
- [ ] Blue primary color correct
- [ ] Purple accent color correct
- [ ] Text color readable
- [ ] Contrast acceptable

#### Animations
- [ ] Smooth transitions between pages
- [ ] Hover effects on buttons
- [ ] Hover effects on cards
- [ ] Loading spinner animation smooth
- [ ] Status badge pulse animation
- [ ] Form input focus animations

#### Responsive Design
- [ ] Mobile (320px) - Perfect
- [ ] Tablet (768px) - Perfect
- [ ] Desktop (1024px) - Perfect
- [ ] Large screen (1920px) - Perfect
- [ ] No horizontal scroll
- [ ] Touch targets adequate size
- [ ] Text readable at all sizes

### Notifications
- [ ] Success toast shows
- [ ] Error toast shows
- [ ] Toasts disappear after delay
- [ ] Multiple toasts queue
- [ ] Close button works
- [ ] Notification position correct

---

## Phase 3: Integration Testing

### Authentication Flow
- [ ] Signup → Dashboard flow works
- [ ] Login → Dashboard flow works
- [ ] Logout → Login redirect works
- [ ] Token persists after refresh
- [ ] Token cleared on logout
- [ ] Can't bypass auth with URL

### Event Workflow
- [ ] Create event → Appears in dashboard
- [ ] Update score → Updates in real-time
- [ ] Add history → Shows in timeline
- [ ] Change status → Updates in real-time
- [ ] Multiple users see same data

### Follow Workflow
- [ ] Follow event → Appears in "Following"
- [ ] Unfollow event → Disappears from "Following"
- [ ] Follower count updates real-time
- [ ] Other users see follower count update
- [ ] Switch between follow/unfollow

### WebSocket Integration
- [ ] Connection established on app load
- [ ] Reconnection on disconnect
- [ ] Join event room on detail page
- [ ] Leave event room on back
- [ ] Multiple tabs sync in real-time
- [ ] No duplicate events from broadcasts
- [ ] Cleanup on component unmount

### Error Recovery
- [ ] Recover from network error
- [ ] Recover from API error
- [ ] Recover from WebSocket disconnect
- [ ] Clear error messages
- [ ] Retry actions work

---

## Phase 4: Cross-Browser Testing

### Chrome
- [ ] All features work
- [ ] Performance acceptable
- [ ] No console errors
- [ ] DevTools integration

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] CSS renders correctly
- [ ] Animations smooth

### Safari
- [ ] All features work
- [ ] WebSocket works
- [ ] LocalStorage works
- [ ] No console errors

### Edge
- [ ] All features work
- [ ] No compatibility issues
- [ ] Performance acceptable

### Mobile Browsers
- [ ] iPhone Safari works
- [ ] Android Chrome works
- [ ] Responsive layout correct
- [ ] Touch interactions smooth

---

## Phase 5: Performance Testing

### Frontend Performance
- [ ] Page load < 3 seconds
- [ ] Dashboard renders < 1 second
- [ ] Event detail < 1 second
- [ ] Smooth animations (60 FPS)
- [ ] No jank on scrolling
- [ ] No memory leaks
- [ ] Bundle size reasonable

### Backend Performance
- [ ] API response < 200ms
- [ ] Database query < 100ms
- [ ] Multiple concurrent users supported
- [ ] WebSocket message < 50ms

### Network
- [ ] Works on 3G connection
- [ ] Works on 4G connection
- [ ] Works on WiFi
- [ ] Graceful degradation on slow network

---

## Phase 6: Security Testing

### Authentication
- [ ] Passwords hashed properly
- [ ] JWT tokens secure
- [ ] No password in logs
- [ ] Token expiration works
- [ ] Refresh token mechanism

### Data Protection
- [ ] CORS properly configured
- [ ] No sensitive data in localStorage
- [ ] HTTPS in production
- [ ] No SQL injection vulnerability
- [ ] Input validation working

### API Security
- [ ] Authentication required for protected routes
- [ ] User can't access other users' data
- [ ] Rate limiting implemented
- [ ] CSRF protection (in production)

---

## Phase 7: Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all elements
- [ ] Tab order logical
- [ ] Enter activates buttons
- [ ] Escape closes modals

### Screen Readers
- [ ] Form labels associated
- [ ] Image alt text present
- [ ] Heading hierarchy correct
- [ ] ARIA labels where needed

### Color & Contrast
- [ ] Text readable
- [ ] Color contrast >= 4.5:1
- [ ] Not dependent on color alone
- [ ] Status icons have text

### Mobile Accessibility
- [ ] Touch targets >= 44px
- [ ] Font size readable
- [ ] No pinch zoom disabled
- [ ] Responsive text

---

## Phase 8: Production Checklist

### Before Deployment
- [ ] All tests passed
- [ ] Code reviewed
- [ ] No console errors
- [ ] No console warnings
- [ ] Sensitive data removed from code
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] SSL certificate ready

### After Deployment
- [ ] Application accessible
- [ ] All features working
- [ ] Performance acceptable
- [ ] Monitoring active
- [ ] Error logging setup
- [ ] Database backup verified
- [ ] CI/CD working
- [ ] Team notified

---

## Known Issues & Limitations

- [ ] No offline support yet
- [ ] No data persistence for events (consider adding)
- [ ] No admin panel for event management
- [ ] Basic error messages (enhance in future)
- [ ] No image support for events

---

## Test Data

### Test User Credentials
```
Email: test@example.com
Password: Test123456
Username: testuser
```

### Test Events
```
Event 1: India vs Pakistan (Cricket, Upcoming)
Event 2: Lakers vs Celtics (Basketball, Live)
Event 3: Champions Final (Football, Completed)
```

---

## Testing Tools

### Recommended Tools
- **API Testing:** Postman / Insomnia
- **Frontend Testing:** React DevTools
- **Network Testing:** Chrome DevTools
- **Load Testing:** Apache JMeter / K6
- **Security Testing:** OWASP ZAP
- **Accessibility:** axe DevTools

---

## Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| QA Lead | __________ | __________ | ☐ Passed |
| Backend Dev | __________ | __________ | ☐ Passed |
| Frontend Dev | __________ | __________ | ☐ Passed |
| Product Owner | __________ | __________ | ☐ Approved |
| DevOps | __________ | __________ | ☐ Deployed |

---

**Testing Last Updated:** December 18, 2025
**Version:** 1.0
