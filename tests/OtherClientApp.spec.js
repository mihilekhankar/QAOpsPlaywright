const { test, expect } = require('@playwright/test');

test('Client App login', async ({ page }) => {

    const email = "mihil@gmail.com";
    const productName = 'ZARA COAT 3';
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill("Admin@123");
    await page.getByRole("button", { name: "Login" }).click();
    // await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();


    await page.locator(".card-body").filter({ hasText: "ZARA COAT 3" }).getByRole("button", { name: "Add To Cart" }).click();

    //Cart
    await page.getByRole("listitem").getByRole("button", { name: "Cart" }).click();
    await page.locator("div li").first().waitFor();
    await expect(page.getByText("ZARA COAT 3")).toBeVisible();
    await page.getByRole("button", { name: "Checkout" }).click();
    await page.getByPlaceholder("Select Country").pressSequentially("ind");
    await page.getByRole("button", { name: "India" }).nth(1).click();
    await page.getByText("PLACE ORDER").click();
    await expect(page.getByText("Thankyou for the order.")).toBeVisible();

    // const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    // console.log(orderId);

    // //Order history
    // await page.locator("li [routerlink*='/dashboard/myorders']").click();
    // await page.locator("tbody tr").first().waitFor();
    // const rows = page.locator("tbody tr");
    // for (let i = 0; i < await rows.count(); i++) {
    //     const rowOrderId = await rows.nth(i).locator("th").textContent();
    //     if (orderId.includes(rowOrderId)) {
    //         await rows.nth(i).locator("button").first().click();
    //         break;
    //     }
    // }
    // const orderDetails = await page.locator(".col-text").textContent();
    // expect(orderId.includes(orderDetails)).toBeTruthy();
    // console.log(orderDetails);

    // await page.pause();


});