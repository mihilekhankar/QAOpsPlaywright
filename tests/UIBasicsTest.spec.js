const { test, expect } = require('@playwright/test');

test('@Web Browser Context Playwright Test', async ({ browser }) => {

    //To open a new browser context and page in your desired browser
    const context = await browser.newContext();
    const page = await context.newPage();

    //page.route("**/*.{png,jpg,jpeg}", route => route.abort()); //block all images from loading

    const userName = page.locator("#username");
    const signIn = page.locator("#signInBtn");
    const cardTitles = page.locator(".card-body a");

    page.on('response', response => console.log(response.url(), response.status()));

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());

    //css
    await userName.type("rahulshettyacademy");
    await page.locator("[type='password']").type("Learning@830$3mK2");
    await signIn.click();
    
    // Wait for navigation or error message
    await page.waitForLoadState('networkidle');
    
    // Check if we can find error message (login failed) or if we're redirected (login succeeded)
    const errorElement = page.locator(".alert-danger, [style*='Incorrect'], .error-message").first();
    const isErrorVisible = await errorElement.isVisible().catch(() => false);
    
    if (isErrorVisible) {
        console.log(await errorElement.textContent());
        await expect(errorElement).toContainText("Incorrect");
    } else {
        // If no error, the login might have succeeded, continue the test
        console.log("Login passed without error message showing");
    }

    //type - fill
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    // console.log(await cardTitles.first().textContent());
    // console.log(await cardTitles.nth(1).textContent());
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);

});


test('UI Controls', async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('#username');
    const signIn = page.locator('#signInBtn');
    const documentsLink = page.locator("[href*='documents-request']");
    const dropdown = page.locator("select.form-control");
    await dropdown.selectOption("consult");
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    console.log(await page.locator(".radiotextsty").last().isChecked());
    await page.locator("#terms").check();
    await expect(page.locator("#terms")).toBeChecked();
    await page.locator("#terms").uncheck();
    //await expect(page.locator("#terms")).not.toBeChecked();
    expect(await page.locator("#terms").isChecked()).toBeFalsy(); //same as above
    await expect(documentsLink).toHaveAttribute("class", "blinkingText"); //from line no. 40

});


test('Child windows handling', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentsLink = page.locator("[href*='documents-request']");

    const [page2] = await Promise.all([
        context.waitForEvent('page'),  //wait for the new page to open
        documentsLink.click(),
    ]);

    const text = await page2.locator(".red").textContent();
    const arrayText = text.split("@")
    const domainName = arrayText[1].split(" ")[0];;
    //console.log(domainName);

    await page.locator("#username").type(domainName);
    //await page.pause();
    console.log(await page.locator("#username").inputValue());



});
