# 📅 Google Calendar Integration

A complete web application that embeds your Google Calendar and provides a REST API for managing calendar events.

## ✨ Features

- **Embedded Google Calendar** - View your calendar directly in the web app
- **REST API** - Full CRUD operations for calendar events
- **Modern UI** - Responsive design with beautiful gradients
- **Real-time Updates** - Auto-refresh calendar every 5 minutes
- **Service Account Authentication** - Secure API access

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create a Service Account
5. Download the JSON key file
6. Rename it to `service-account.json` and place in project root

### 3. Share Calendar with Service Account

1. Open Google Calendar
2. Find your calendar in left sidebar
3. Click three dots → "Settings and sharing"
4. Under "Share with specific people", add your service account email
5. Give it "Make changes to events" permission

### 4. Start the Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

### 5. Open in Browser

Navigate to: http://localhost:3000

## 🔌 API Endpoints

### Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `GET` | `/events` | List all calendar events |
| `GET` | `/events/:id` | Get specific event details |
| `POST` | `/events` | Create a new event |
| `PUT` | `/events/:id` | Update an existing event |
| `DELETE` | `/events/:id` | Delete an event |

### Example API Usage

#### Create Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Team Meeting",
    "description": "Weekly sync meeting",
    "location": "Conference Room A",
    "start": "2025-08-25T10:00:00+07:00",
    "end": "2025-08-25T11:00:00+07:00"
  }'
```

#### List Events
```bash
curl http://localhost:3000/api/events
```

#### Get Event Details
```bash
curl http://localhost:3000/api/events/EVENT_ID_HERE
```

## 🧪 Testing

### Test the API
```bash
npm run test
```

### Test the Web Interface
1. Start the server: `npm start`
2. Open http://localhost:3000
3. Use the "Test API" button to verify connectivity
4. Check the "API Info" section for endpoint details

## 📁 Project Structure

```
google-calendar-integration/
├── index.html              # Web interface with embedded calendar
├── server.js               # Express server with API endpoints
├── app.js                  # Google Calendar API test script
├── test-api.js             # API testing script
├── service-account.json    # Google service account credentials
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## ⚙️ Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)
- `CALENDAR_ID` - Your Google Calendar ID (set in server.js)

### Calendar ID Format

- **Primary Calendar**: `your-email@gmail.com`
- **Group Calendar**: `group-id@group.calendar.google.com`
- **Custom Calendar**: `custom-id@calendar.google.com`

## 🔒 Security Notes

- **Never commit** `service-account.json` to version control
- The file is already in `.gitignore`
- Keep your service account credentials secure
- Only share calendars with necessary permissions

## 🐛 Troubleshooting

### Common Issues

1. **"Calendar not found" (404)**
   - Verify calendar ID is correct
   - Ensure calendar is shared with service account
   - Check service account permissions

2. **"Access forbidden" (403)**
   - Calendar not shared with service account
   - Insufficient permissions granted

3. **"Authentication failed"**
   - Check service account JSON file
   - Verify Google Calendar API is enabled
   - Ensure proper scopes are set

### Debug Steps

1. Check server logs for detailed error messages
2. Verify service account has correct permissions
3. Test API endpoints individually
4. Check calendar sharing settings

## 📚 Additional Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - see LICENSE file for details.
