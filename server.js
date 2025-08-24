const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Google Calendar configuration
const KEYFILEPATH = path.join(__dirname, 'service-account.json');
const CALENDAR_ID = 'b8a832bd6facdcc5827d8b05327ae51858849fcb52a8ba831df74c8d376cbc30@group.calendar.google.com';
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Initialize Google Calendar API
function getCalendarService() {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES
    });
    return google.calendar({ version: 'v3', auth });
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes
app.get('/api/events', async (req, res) => {
    try {
        const calendar = getCalendarService();
        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: new Date().toISOString(),
            maxResults: 50,
            singleEvents: true,
            orderBy: 'startTime'
        });

        res.json(response.data.items || []);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ 
            error: 'Failed to fetch events', 
            details: error.message 
        });
    }
});

app.get('/api/events/:id', async (req, res) => {
    try {
        const calendar = getCalendarService();
        const response = await calendar.events.get({
            calendarId: CALENDAR_ID,
            eventId: req.params.id
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ 
            error: 'Failed to fetch event', 
            details: error.message 
        });
    }
});

app.post('/api/events', async (req, res) => {
  try {
    const { summary, description, start, end, location } = req.body;
    
    if (!summary || !start || !end) {
      return res.status(400).json({ 
        error: 'Missing required fields: summary, start, end' 
      });
    }

    // Ensure proper datetime format with timezone
    const formatDateTime = (dateTimeStr) => {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid datetime format');
      }
      // Format as ISO string with timezone offset
      return date.toISOString();
    };

    const event = {
      summary,
      description,
      location,
      start: {
        dateTime: formatDateTime(start),
        timeZone: 'Asia/Jakarta'
      },
      end: {
        dateTime: formatDateTime(end),
        timeZone: 'Asia/Jakarta'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 30 },
          { method: 'popup', minutes: 10 }
        ]
      }
    };

    const calendar = getCalendarService();
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      error: 'Failed to create event', 
      details: error.message 
    });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const { summary, description, start, end, location } = req.body;
    
    // Ensure proper datetime format with timezone
    const formatDateTime = (dateTimeStr) => {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid datetime format');
      }
      // Format as ISO string with timezone offset
      return date.toISOString();
    };
    
    const event = {
      summary,
      description,
      location,
      start: {
        dateTime: formatDateTime(start),
        timeZone: 'Asia/Jakarta'
      },
      end: {
        dateTime: formatDateTime(end),
        timeZone: 'Asia/Jakarta'
      }
    };

    const calendar = getCalendarService();
    const response = await calendar.events.update({
      calendarId: CALENDAR_ID,
      eventId: req.params.id,
      resource: event
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ 
      error: 'Failed to update event', 
      details: error.message 
    });
  }
});

app.delete('/api/events/:id', async (req, res) => {
    try {
        const calendar = getCalendarService();
        await calendar.events.delete({
            calendarId: CALENDAR_ID,
            eventId: req.params.id
        });

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ 
            error: 'Failed to delete event', 
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        calendar: CALENDAR_ID
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error', 
        details: err.message 
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📅 Calendar ID: ${CALENDAR_ID}`);
    console.log(`🔌 API available at http://localhost:${PORT}/api/events`);
});
