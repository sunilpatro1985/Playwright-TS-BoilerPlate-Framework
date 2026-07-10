import { LoginPage } from "@pages/LoginPage";
import { test } from '@playwright/test';

test(`Verify emulation of saucedemo login page.`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToURL();
    await loginPage.loginToApplication();

});
