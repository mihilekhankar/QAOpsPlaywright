const { test, expect } = require('@playwright/test');
const { futureDateValue } = require('../dateHelper');


test('Event Booking', async ({ page }) => {
    const email = "mihil@mail.com";
    const password = "Admin@123";
    await page.goto("https://eventhub.rahulshettyacademy.com");
    await page.getByPlaceholder("you@email.com").fill(email);
    await page.locator("label[for='password']").fill(password);
    await page.locator("#login-btn").click();
    await page.waitForLoadState('networkidle');

    await page.getByRole("button", { name: "Admin" }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Manage Events' }).click();

    //2 Create a new event
    const eventTitle = `Test Event ${Date.now()}`;

    await page.locator("#event-title-input").fill(eventTitle);
    await page.locator("#admin-event-form textarea").fill("This is a test event description.");
    await page.getByLabel("City").fill("Mumbai");
    await page.getByLabel("Venue").fill("Bandra Kurla Complex, Bandra East, Mumbai");
    await page.getByLabel('Event Date & Time').fill(futureDateValue());
    await page.getByLabel("Price ($)").fill("100");
    await page.getByLabel("Total Seats").fill("50");
    await page.locator("#add-event-btn").click();
    // await expect(page.getByText('✓Event created!×')).toBeVisible({ timeout: 15000 });
    const toast = page.getByText(/Event created!/i);
    await toast.waitFor({ state: 'visible' });


    //3 Event card and capture seats
    await page.locator("#nav-events").click();
    // All event cards
    const eventCards = page.getByTestId("event-card");
    // First card visible
    await expect(eventCards.first()).toBeVisible();
    // Find your event
    const eventCard = eventCards.filter({ hasText: eventTitle });
    await expect(eventCard).toBeVisible({ timeout: 5000 });
    // Read seat text
    const seatText = await eventCard.getByText("seats available").textContent();
    const seatsBeforeBooking = Number(seatText.match(/\d+/)[0]);
    console.log(`Seats before booking: ${seatsBeforeBooking}`);


    //4 Start Booking
    await eventCard.getByTestId("book-now-btn").click();

    //5 Fill booking form
    await expect(page.locator('#ticket-count')).toContainText('1');
    await page.getByLabel("Full Name").fill("Mihil");
    await page.locator("#customer-email").fill(email);
    await page.getByPlaceholder("+91 98765 43210").fill("9876543210");
    await page.locator(".confirm-booking-btn").click();

    //6 Verify booking confirmation
    const bookingRefElement = page.locator(".booking-ref").first();
    await expect(bookingRefElement).toBeVisible();
    const bookingRef = (await bookingRefElement.innerText()).trim();
    console.log("Booking Reference:", bookingRef);

    //7 Verify Booking
    await page.locator("#nav-bookings").click();
    await expect(page).toHaveURL(/\/bookings$/);
    const bookingCards = page.locator("#booking-card");
    await expect(bookingCards.first()).toBeVisible();
    const matchedBooking = bookingCards.filter({ has: page.locator(".booking-ref", {hasText: bookingRef})});
    await expect(matchedBooking).toBeVisible();
    await expect(matchedBooking).toContainText(eventTitle);

    //8 Verify seat reduction
    await page.locator("#nav-events").click();
    const allCards = page.getByTestId("event-card");
    await expect(allCards.first()).toBeVisible();
    const myCard = allCards.filter({ hasText: eventTitle });
    await expect(myCard).toBeVisible({ timeout: 5000 });
    const seatCount = await myCard.getByText("seats available").textContent();
    const seatAfterBooking = Number(seatCount.match(/\d+/)[0]);
    console.log(`Seats after booking: ${seatAfterBooking}`);
    await expect(seatAfterBooking).toBe(seatsBeforeBooking - 1);
    




    await page.pause();

});