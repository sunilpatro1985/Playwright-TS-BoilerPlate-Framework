import test from '@base/BaseTest';

test(`Generate and verify HAR file for Personal Information.`, async ({ page, loginPage }) => {
    // To record HAR file use below line where "update:true"
    // This line creates a directory named har and stores all the har related files in it.
    await page.routeFromHAR('har/personalInfo.har', { update: true });

    // Once you record the har file you can uncomment the below line for Network Replay with update:false
    // The below line uses the har file from the recorded directory.
    // await page.routeFromHAR('har/personalInfo.har', { update: false });

    await test.step('Open the application and sign in', async () => {
        await loginPage.navigateToURL();
        await loginPage.loginToApplication();
    });

  


});