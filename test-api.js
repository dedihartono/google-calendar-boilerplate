const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
    console.log('🧪 Testing Google Calendar API...\n');

    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await fetch(`${BASE_URL}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData.status);
        console.log('📅 Calendar ID:', healthData.calendar);
        console.log('⏰ Timestamp:', healthData.timestamp);
        console.log('');

        // Test events list endpoint
        console.log('2. Testing events list endpoint...');
        const eventsResponse = await fetch(`${BASE_URL}/events`);
        const eventsData = await eventsResponse.json();
        console.log('✅ Events fetched successfully');
        console.log('📋 Number of events:', eventsData.length);
        if (eventsData.length > 0) {
            console.log('📅 First event:', eventsData[0].summary);
        }
        console.log('');

        // Test event creation
        console.log('3. Testing event creation...');
        const newEvent = {
            summary: 'API Test Event',
            description: 'This event was created via API test',
            location: 'Test Location',
            start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString() // Tomorrow + 1 hour
        };

        const createResponse = await fetch(`${BASE_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEvent)
        });

        if (createResponse.ok) {
            const createdEvent = await createResponse.json();
            console.log('✅ Event created successfully');
            console.log('🆔 Event ID:', createdEvent.id);
            console.log('📅 Event summary:', createdEvent.summary);
            console.log('🔗 Event link:', createdEvent.htmlLink);
            console.log('');

            // Test event update
            console.log('4. Testing event update...');
            const updateData = {
                summary: 'Updated API Test Event',
                description: 'This event was updated via API test',
                start: newEvent.start,
                end: newEvent.end
            };

            const updateResponse = await fetch(`${BASE_URL}/events/${createdEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (updateResponse.ok) {
                const updatedEvent = await updateResponse.json();
                console.log('✅ Event updated successfully');
                console.log('📅 Updated summary:', updatedEvent.summary);
                console.log('');

                // Test event deletion
                console.log('5. Testing event deletion...');
                const deleteResponse = await fetch(`${BASE_URL}/events/${createdEvent.id}`, {
                    method: 'DELETE'
                });

                if (deleteResponse.ok) {
                    console.log('✅ Event deleted successfully');
                } else {
                    console.log('❌ Failed to delete event');
                }
            } else {
                console.log('❌ Failed to update event');
            }
        } else {
            console.log('❌ Failed to create event');
            const errorData = await createResponse.json();
            console.log('Error details:', errorData);
        }

    } catch (error) {
        console.error('❌ API test failed:', error.message);
    }
}

// Run the test
testAPI();
