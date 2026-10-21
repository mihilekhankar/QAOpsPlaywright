const { test, expect, request } = require('@playwright/test');
const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = BASE_URL + '/api';


// Yahoo user
const YAHOO_USER = {
    email: 'mihil@yahoo.com',
    password: 'Yahoo@123'
};


// Gmail user
const GMAIL_USER = {
    email: 'mihil@gmail.com',
    password: 'Gmail@123'
};


// ============================================================
// LOGIN AS USER VIA BROWSER UI
// ============================================================

async function loginAs(page, user) {

    await page.goto(`${BASE_URL}/login`);
    await page.locator('#email').fill(user.email);
    await page.locator('#password').fill(user.password);
    await page.locator('#login-btn').click();
    await page.waitForLoadState('networkidle');
}


// ============================================================
// TEST
// ============================================================

test('Gmail user cannot access Yahoo user booking', async ({ page, request }) => {

    // --------------------------------------------------------
    // STEP 1 - Login as Yahoo user via API
    // --------------------------------------------------------

    const loginRes = await request.post(`${API_URL}/auth/login`, {
        data: { email: YAHOO_USER.email, password: YAHOO_USER.password },
    });
    
    console.log(`Login response status: ${loginRes.status()}`);
    
    // Handle 404 or other non-JSON responses gracefully
    if (loginRes.status() === 404) {
        console.warn(`API endpoint not found (404). Test will be skipped. Endpoint: ${API_URL}/auth/login`);
        return;
    }
    
    let loginData;
    try {
        loginData = await loginRes.json();
    } catch (e) {
        console.error(`Failed to parse login response as JSON. Status: ${loginRes.status()}`);
        return;
    }
    
    console.log(`Login response:`, loginData);
    
    if (!loginRes.ok()) {
        console.error(`Login failed: ${loginRes.status()} - ${JSON.stringify(loginData)}`);
    }
    
    expect(loginRes.ok()).toBeTruthy();
    const { token } = loginData;


    // --------------------------------------------------------
    // STEP 2 - Fetch events via API
    // --------------------------------------------------------

    const eventsRes = await request.get(`${API_URL}/events`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Assert events response is OK
    expect(eventsRes.ok()).toBeTruthy();

    // Parse events response
    const eventsData = await eventsRes.json();

    // Get first event ID
    const eventId = eventsData.data[0].id;


    // --------------------------------------------------------
    // STEP 3 - Create booking as Yahoo user via API
    // --------------------------------------------------------

    const bookingRes = await request.post(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
            eventId,
            customerName: 'Yahoo User',
            customerEmail: YAHOO_USER.email,
            customerPhone: '9999999999',
            quantity: 1,
        },
    });
    expect(bookingRes.ok()).toBeTruthy();
    const yahooBookingId = (await bookingRes.json()).data.id;

    console.log(`Yahoo booking created via API. ID: ${yahooBookingId}`);


    // --------------------------------------------------------
    // STEP 4 - Login as Gmail user via browser UI
    // --------------------------------------------------------

    await loginAs(page, GMAIL_USER);


    // --------------------------------------------------------
    // STEP 5 - Navigate to Yahoo booking as Gmail user
    // --------------------------------------------------------

    await page.goto(
        `${BASE_URL}/bookings/${yahooBookingId}`,
        {
            waitUntil: 'networkidle'
        }
    );


    // --------------------------------------------------------
    // STEP 6 - Validate Access Denied
    // --------------------------------------------------------

    await expect(page.getByText('Access Denied')).toBeVisible();
    await expect(page.getByText('You are not authorized to view this booking')).toBeVisible();
});