import { HomePage } from "@pages/HomePage";
import { LoginPage } from "@pages/LoginPage";
import { expect, test } from '@playwright/test';

test(`Verify User Login.`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
  
    await loginPage.navigateToURL();
    await loginPage.loginToApplication();
    await homePage.waitforSwaglabsHomePage();

    expect(await page.screenshot()).toMatchSnapshot('saucedemo_homepage.png');
});
