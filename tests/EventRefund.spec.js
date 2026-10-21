const { test, expect } = require('@playwright/test');
const { loginAndGoToBooking } = require('../loginHelper');

test('Single ticket booking is eligible for refund', async ({ page }) => {

    // Step 1 - Login
    await loginAndGoToBooking(page);

    // Step 2 - Book first event with 1 ticket
    await page.locator("#nav-events").click();
    await page.getByTestId("event-card").first().getByTestId("book-now-btn").click();
    await page.getByLabel("Full Name").fill("Mihil");
    await page.locator("#customer-email").fill("mihil@mail.com");
    await page.getByPlaceholder("+91 98765 43210").fill("9876543210");
    await page.locator(".confirm-booking-btn").click();

    // Step 3 - Navigate to booking detail
    await page.locator("#nav-bookings").click();
    await expect(page).toHaveURL(/\/bookings$/);
    await page.getByRole('link', { name: 'View Details' }).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    // Step 4 - Validate booking ref
    const bookingRef = (await page.locator(".font-mono.font-bold.text-indigo-600.bg-indigo-50.px-3.py-1.rounded-lg.text-sm").first().innerText()).trim();
    const eventTitle = (await page.locator("h1").innerText()).trim();
    console.log("Booking Ref:", bookingRef);
    console.log("Event Title:", eventTitle);
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

    // Step 5 - Check refund eligibility
    await page.locator("#check-refund-btn").click();
    await expect(page.getByRole('status', { name: 'Loading' })).toBeVisible();
    await expect(page.getByRole('status', { name: 'Loading' })).toBeHidden({ timeout: 6000 });

    // Step 6 - Validate result
    await expect(page.locator('#refund-result')).toBeVisible();
    await expect(page.locator('#refund-result')).toContainText('Eligible for refund');
    await expect(page.locator('#refund-result')).toContainText('Single-ticket bookings qualify for a full refund');


});


test.skip('Group ticket booking is NOT eligible for refund', async ({ page }) => {

    // Step 1 - Login
    await loginAndGoToBooking(page);

    // Step 2 - Book first event with 1 ticket
    await page.locator("#nav-events").click();
    await page.getByTestId("event-card").first().getByTestId("book-now-btn").click();
    await page.getByRole('button', { name: "+" }).click({clickCount: 2});
    await page.getByLabel("Full Name").fill("Mihil");
    await page.locator("#customer-email").fill("mihil@mail.com");
    await page.getByPlaceholder("+91 98765 43210").fill("9876543210");
    await page.locator(".confirm-booking-btn").click();

    // Step 3 - Navigate to booking detail
    await page.locator("#nav-bookings").click();
    await expect(page).toHaveURL(/\/bookings$/);
    await page.getByRole('link', { name: 'View Details' }).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    // Step 4 - Validate booking ref
    const bookingRef = (await page.locator(".font-mono.font-bold.text-indigo-600.bg-indigo-50.px-3.py-1.rounded-lg.text-sm").first().innerText()).trim();
    const eventTitle = (await page.locator("h1").innerText()).trim();
    console.log("Booking Ref:", bookingRef);
    console.log("Event Title:", eventTitle);
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

    // Step 5 - Check refund eligibility
    await page.locator("#check-refund-btn").click();
    await expect(page.getByRole('status', { name: 'Loading' })).toBeVisible();
    await expect(page.getByRole('status', { name: 'Loading' })).toBeHidden({ timeout: 6000 });

    // Step 6 - Validate result
    await expect(page.locator('#refund-result')).toBeVisible();
    await expect(page.locator('#refund-result')).toContainText('Not eligible for refund');
    await expect(page.locator('#refund-result')).toContainText('Group bookings (3 tickets) are non-refundable');
    

    await page.pause();

});