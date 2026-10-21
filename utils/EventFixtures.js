const base = require('@playwright/test');
const { expect } = base;
const LOGIN_URL = 'https://eventhub.rahulshettyacademy.com';
const API_BASE_URL = 'https://api.eventhub.rahulshettyacademy.com';

const loginPayload = { email: "mihil@mail.com", password: "Admin@123" };

exports.test = base.test.extend({

    autheticatedPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(LOGIN_URL);
        await page.locator("#email").fill(loginPayload.email);
        await page.locator("#password").fill(loginPayload.password);
        await page.locator("#login-btn").click();
        await expect(page.getByText('Featured Events')).toBeVisible();
        await use(page);
        await context.close();
    },

    createEvent: async ({ playwright }, use) => {
        const apiContext = await playwright.request.newContext({ baseURL: API_BASE_URL });

        // confirmed response shape: { success, token, user: { id, email } }
        const loginRes = await apiContext.post('/api/auth/login', { data: loginPayload });
        const loginBody = await loginRes.json();
        const token = loginBody.token;

        const eventPayload = {
            title: `Automation Test Event ${Date.now()}`,
            description: 'Created by an automated Playwright fixture for testing.',
            category: 'Conference',
            venue: 'Bangalore International Centre',
            city: 'Bangalore',
            eventDate: '2026-09-15T09:00:00.000Z',
            price: 1500,
            totalSeats: 500,
            imageUrl: 'https://example.com/images/automation-event.jpg',
        };

        const createRes = await apiContext.post('/api/events', {
            data: eventPayload,
            headers: { Authorization: `Bearer ${token}` },
        });
        const body = await createRes.json();
        const event = body.data; // event object is nested under "data"

        await use(event);

        // teardown — clean up the event after the test finishes
        await apiContext.delete(`/api/events/${event.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        await apiContext.dispose();
    },
});

exports.expect = expect;