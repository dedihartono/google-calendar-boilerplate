const { google } = require('googleapis')
const path = require('path')

// Path to your service account JSON key file
const KEYFILEPATH = path.join(__dirname, 'service-account.json')

// Calendar ID - use the specific calendar you want to access
// This can be your personal Gmail calendar ID or any shared calendar ID
const CALENDAR_ID = 'b8a832bd6facdcc5827d8b05327ae51858849fcb52a8ba831df74c8d376cbc30@group.calendar.google.com'

// Scopes for Google Calendar
const SCOPES = ['https://www.googleapis.com/auth/calendar']

async function createEvent() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
  })

  const calendar = google.calendar({ version: 'v3', auth })

  const event = {
    summary: 'Team Meeting',
    location: 'Jakarta, Indonesia',
    description: 'Weekly sync meeting',
    start: {
      dateTime: '2025-08-25T10:00:00+07:00',
      timeZone: 'Asia/Jakarta',
    },
    end: {
      dateTime: '2025-08-25T11:00:00+07:00',
      timeZone: 'Asia/Jakarta',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 30 },
        { method: 'popup', minutes: 10 }
      ]
    }
  }

  try {
    console.log(`📝 Creating event in calendar: ${CALENDAR_ID}`)
    const res = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event
    })
    console.log('✅ Event created successfully!')
    console.log('🔗 Event link:', res.data.htmlLink)
    return res.data
  } catch (err) {
    console.error('❌ Error creating event:', err.message)
    if (err.code === 404) {
      console.error('💡 Calendar not found. Make sure:')
      console.error('   1. The calendar ID is correct')
      console.error('   2. The service account has access to this calendar')
      console.error('   3. The calendar is shared with your service account email')
      console.error('   4. The calendar ID format is correct')
    }
    throw err
  }
}

async function testCalendarAccess() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
  })

  const calendar = google.calendar({ version: 'v3', auth })

  try {
    console.log('🔍 Testing calendar access...')
    console.log(`📅 Calendar ID: ${CALENDAR_ID}`)
    
    // Try to get calendar details to test access
    const calendarInfo = await calendar.calendars.get({
      calendarId: CALENDAR_ID
    })
    
    console.log('✅ Calendar access confirmed!')
    console.log(`📋 Calendar name: ${calendarInfo.data.summary}`)
    console.log(`📍 Timezone: ${calendarInfo.data.timeZone}`)
    
    return true
  } catch (err) {
    console.error('❌ Cannot access calendar:', err.message)
    if (err.code === 404) {
      console.error('💡 Calendar not found or access denied')
    } else if (err.code === 403) {
      console.error('💡 Access forbidden - calendar not shared with service account')
    }
    return false
  }
}

async function main() {
  try {
    // First test if we can access the calendar
    const hasAccess = await testCalendarAccess()
    
    if (hasAccess) {
      // Then create an event
      await createEvent()
    } else {
      console.log('❌ Cannot proceed without calendar access')
    }
  } catch (error) {
    console.error('❌ Main function error:', error.message)
  }
}

main()
