const { test, expect } = require('@playwright/test');
let webContext;

test.beforeAll(async ({browser}) => {

    const context = await browser.newContext();   
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.locator("#userEmail").fill("mihil@gmail.com");
    await page.locator("#userPassword").fill("Admin@123");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await context.storageState({ path: 'state.json' }); 
    await browser.newContext({ storageState: 'state.json' });
    webContext = await browser.newContext({ storageState: 'state.json' });
});

test('Client App login', async () => {

    const productName = 'ZARA COAT 3';
    
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

    const products = page.locator(".card-body");
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    //console.log(titles);
    const productCount = await products.count();
    for (let i = 0; i < productCount; i++) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            //add to cart
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }

    //Cart

    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(bool).toBeTruthy();
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").pressSequentially("ind", { delay: 100 });
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for (let i = 0; i < optionsCount; i++) {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text.trim() === "India") {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    expect(await page.locator(".user__name [type='text']").first()).toHaveText("mihil@gmail.com");
    await page.locator(".action__submit").first().click();
    await expect(page.locator(".hero-primary")).toHaveText("Thankyou for the order.");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);


    //Order history
    await page.locator("li [routerlink*='/dashboard/myorders']").click();
    await page.locator("tbody tr").first().waitFor();
    const rows = page.locator("tbody tr");
    for (let i = 0; i < await rows.count(); i++) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderDetails)).toBeTruthy();
    console.log(orderDetails);

    //await page.pause();


});

test('@API Test Case 2', async () => {

    const productName = 'ZARA COAT 3';
    
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    
    const products = page.locator(".card-body");
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
});