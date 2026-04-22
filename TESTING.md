# Frontend Testing Guide

## Quick Start

### 1. Install & Run
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Demo Flow

### Test Case 1: Waste Giver User

1. **Login**
   - Email: any@email.com
   - Password: any password
   - User type: Random (if "giver", you get Waste Giver role)
   - If not giver, go back to login and try again

2. **Create Request**
   - Click "+ Create Request"
   - App will auto-detect your location (mock)
   - Enter weight: 25 kg
   - Submit
   - App shows request tracking page

3. **Track Request**
   - Watch as request status updates:
     - Pending → Being matched with driver
     - Accepted → Driver assigned
     - Collected → Waste picked up
   - Real-time driver location polling shows location updates

4. **Dashboard**
   - See all past requests
   - View status of each request
   - Stats showing total, pending, accepted, collected

### Test Case 2: Waste Collector (Driver) User

1. **Login**
   - Wait for collector/driver role
   - If not collector, retry login

2. **Driver Dashboard**
   - See vehicle info (capacity, current load)
   - List of nearby requests with:
     - Business name
     - Location
     - Weight
     - Distance
     - Available space check

3. **Accept Request**
   - Click "Accept Request" on any item
   - Navigates to route page

4. **Route Tracking**
   - Shows all assigned pickups (multiple stops)
   - Real-time GPS location updates
   - Mark each stop as collected
   - Vehicle capacity tracking

### Test Case 3: Admin User

1. **Login**
   - Select Admin role during registration

2. **Dashboard** (Coming Soon)
   - Overview of all requests
   - All drivers and their status
   - System metrics

## Features Implemented ✅

### Auth System
- ✅ Login with mock authentication
- ✅ Register with user type selection
- ✅ Protected routes based on user type
- ✅ Form validation
- ✅ Session persistence (localStorage)

### Waste Giver Flow
- ✅ Dashboard with request list
- ✅ Create new pickup request
- ✅ Real-time request status tracking
- ✅ Mock GPS location capture
- ✅ Request statistics
- ✅ Status progress indicators

### Waste Collector Flow
- ✅ Driver dashboard with vehicle info
- ✅ Nearby requests list
- ✅ Capacity validation
- ✅ Route page with multiple stops
- ✅ Real-time location updates
- ✅ Mark collections as complete
- ✅ Vehicle capacity bar

### UI Components
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Tailwind CSS styling
- ✅ Reusable button, input, card components
- ✅ Status badges
- ✅ Loading states
- ✅ Notifications system

### State Management
- ✅ Context API for global state
- ✅ Request polling service
- ✅ Mock localStorage persistence

## Polling Updates

The app uses polling to simulate real-time updates:

- **Waste Giver**: Request status and driver location updated every 3 seconds
- **Driver**: Location updated every 3 seconds
- **Update Chances**:
  - 30% chance to accept pending request
  - 20% chance to collect accepted request
  - Location moves slightly each poll

## Responsive Design

The app works on:
- ✅ Desktop (1920px+)
- ✅ Laptop (1024px+)
- ✅ Tablet (768px+)
- ✅ Mobile (320px+)

Test by resizing browser or using mobile device emulation in DevTools.

## Next Steps

After backend implementation, these will connect to real APIs:
- User registration persistence
- Real database for requests
- Real GPS coordinates
- Driver matching algorithm
- Push notifications
- Dump yard management
- Admin analytics
