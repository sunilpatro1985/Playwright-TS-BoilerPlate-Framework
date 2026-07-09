import { test as baseTest } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';


const test = baseTest.extend<{
    loginPage: LoginPage;
    homePage: HomePage;

}>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    }
});

export default test;