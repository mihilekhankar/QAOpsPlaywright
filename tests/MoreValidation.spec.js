const { test, expect } = require('@playwright/test');

test.describe.configure({mode: 'serial'}); //Run test in serial mode, if one failed then other test will skip

test('@Web More Validate', async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    // await page.goto("http://google.com");
    // await page.goBack();
    // await page.goForward();
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const text = await framesPage.locator(".text h2").textContent();
    console.log(text);


});