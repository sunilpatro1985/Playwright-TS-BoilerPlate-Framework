import { LoginPage } from "@pages/LoginPage";
import { test } from '@playwright/test';

test(`Verify My Personal Information.`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToURL();
    await loginPage.loginToApplication();

});
