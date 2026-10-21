const { Before,After,BeforeStep,AfterStep } = require("@cucumber/cucumber");
const { POManager } = require('../../pageobjects/POManager');
const playwright = require('playwright');

Before(async function () {
    const browser = await playwright.chromium.launch(
        {
            headless: false,
        }
    );
    const context = await browser.newContext();
    this.page = await browser.newPage();
    this.poManager = new POManager(this.page);
});

BeforeStep(async function () {
    console.log("Before Step");
});


AfterStep(async function ({result}) {
    if (result.status === "FAILED") {
        const screenshot = await this.page.screenshot({ path: `./screenshots/${Date.now()}.png`, fullPage: true });
        this.attach(screenshot, 'image/png');
    }
});


After(async function () {
    console.log("Closing the browser");
});