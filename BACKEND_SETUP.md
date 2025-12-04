# Backend Configuration Guide

This frontend connects to a separate backend repository: **sia-backend**

## Backend Repository
- **GitHub**: https://github.com/hy461283-sudo/sia-backend.git
- **Local Path**: `/Users/harsh/sia-backend` (if cloned locally)

## Configuration

### Frontend (this repo)

The frontend uses the `VITE_API_BASE_URL` environment variable to connect to the backend.

#### Local Development
Create a `.env` file in the root directory:
```bash
VITE_API_BASE_URL=http://localhost:5050
```

#### Production (Vercel)
Set the environment variable in Vercel dashboard:
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add: `VITE_API_BASE_URL` = `https://your-backend-domain.com`

### Backend (sia-backend repo)

The backend needs these environment variables (create `.env` in the backend repo):

```bash
# MongoDB Connection
MONGO_URL=mongodb://127.0.0.1:27017/sia

# Server Port
PORT=5050

# Backend URL (for file serving and email links)
BACKEND_URL=http://localhost:5050

# Twilio Configuration (for OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_SERVICE_ID=your_twilio_service_id

# SMTP Configuration (for emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Running Locally

### Backend
```bash
cd /Users/harsh/sia-backend
npm install
npm run dev  # or npm start
```

### Frontend
```bash
cd /Users/harsh/intership-allotment-main
npm install
npm run dev
```

## API Endpoints Used

The frontend calls these backend endpoints:
- `POST /api/organization/login`
- `GET /api/organization/projects/:orgId`
- `POST /api/organization/projects`
- `PUT /api/organization/projects/:id`
- `DELETE /api/organization/projects/:id`
- `PUT /api/organization/:orgId/settings` (added for settings page)

## Notes

- The backend repo now includes the `/api/organization/:orgId/settings` endpoint
- Both repos use the same MongoDB database
- Make sure both are running on compatible ports (backend: 5050, frontend: 5173 by default)

