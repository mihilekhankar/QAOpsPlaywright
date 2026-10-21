const { expect } = require('@playwright/test');

async function loginAndGoToBooking(page) {
    await page.goto("https://eventhub.rahulshettyacademy.com");

    // Login
    await page.getByLabel("Email").fill("mihil@mail.com");
    await page.getByLabel("Password").fill("Admin@123");

    await page.locator("#login-btn").click();

    // Verify successful login
    await expect(page.getByRole('link', { name: 'Browse Events' }).first()).toBeVisible();
}

module.exports = { loginAndGoToBooking };