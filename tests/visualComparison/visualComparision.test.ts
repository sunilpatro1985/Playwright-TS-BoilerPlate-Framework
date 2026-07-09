import { LoginPage } from "@pages/LoginPage";
import { expect, test } from '@playwright/test';

test(`Verify User Login.`, async ({ page }) => {
    const loginPage = new LoginPage(page);
  

    await loginPage.navigateToURL();
    await loginPage.loginToApplication();
  

    expect(await page.screenshot()).toMatchSnapshot('MyAccountView.png');
});
