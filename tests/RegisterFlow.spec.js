import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    //   await page.getByText('Register here').click();
    //   await page.getByRole('textbox', { name: 'First Name' }).click();
    //   await page.getByRole('textbox', { name: 'First Name' }).fill('Mihil');
    //   await page.getByRole('textbox', { name: 'Last Name' }).click();
    //   await page.getByRole('textbox', { name: 'Last Name' }).fill('Ekhankar');
    //   await page.getByRole('textbox', { name: 'email@example.com' }).click();
    //   await page.getByRole('textbox', { name: 'email@example.com' }).fill('mihil1@gmail.com');
    //   await page.getByRole('textbox', { name: 'enter your number' }).click();
    //   await page.getByRole('textbox', { name: 'enter your number' }).fill('8401143043');
    //   await page.getByRole('combobox').selectOption('3: Engineer');
    //   await page.getByRole('radio', { name: 'Male', exact: true }).check();
    //   await page.getByRole('textbox', { name: 'Passsword' }).click();
    //   await page.getByRole('textbox', { name: 'Passsword' }).fill('Admin@1234');
    //   await page.getByRole('textbox', { name: 'Confirm Password' }).click();
    //   await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Admin@1234');
    //   await page.getByRole('checkbox').check();
    //   await page.getByRole('button', { name: 'Register' }).click();
    //   await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'email@example.com' }).click();
    await page.getByRole('textbox', { name: 'email@example.com' }).fill('mihil@gmail.com');
    await page.getByRole('textbox', { name: 'enter your passsword' }).click();
    await page.getByRole('textbox', { name: 'enter your passsword' }).fill('Admin@123');
    await page.getByRole('button', { name: 'Login' }).click();

    //await page.waitForLoadState('networkidle');  //This can generate flaky test sometimes so you can use below command instead
    await page.locator(".card-body b").first().waitFor();
    const productName = await page.locator(".card-body b").allTextContents();
    //   const productName = await page.getByText('ADIDAS ORIGINAL').textContent();
    console.log(productName);
});