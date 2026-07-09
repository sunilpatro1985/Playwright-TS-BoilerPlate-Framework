import test from '@base/BaseTest';

test(`Login to Sauce DEMO page.`, async ({ loginPage }) => {
    await test.step('Navigate to the application', async () => {
        await loginPage.navigateToURL();
    });

    await test.step('Log in to the application', async () => {
        await loginPage.loginToApplication();
    });
});