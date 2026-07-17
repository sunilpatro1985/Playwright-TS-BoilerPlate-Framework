import { PageActions } from "@base/PageActions";
import type { Page } from '@playwright/test';
import { getCredentials, getDynamicBaseUrl } from '../testConfig';
import { logger } from '../CustomReporterConfig';

let pageActions: PageActions;
 

export class LoginPage{
    readonly page: Page;
    protected  EMAIL_EDITBOX_ID = `#user-name`; //a dot (.) represents a class name, while a hash (#) represents an ID
    protected  PASSWORD_EDITBOX_ID = `#password`;
    protected  SIGN_IN_BUTTON_ID = `#login-button`;

    constructor(page: Page) {
        this.page = page;
        pageActions = new PageActions(this.page);
    }

    async navigateToURL(): Promise<void> {
        await pageActions.navigateToURL();
    }

    async loginToApplication(): Promise<void> {
        const { username, password } = getCredentials();
        logger.info(`Username: ${username}, Password: ${password}`);

        await pageActions.enterElementText(this.EMAIL_EDITBOX_ID, username);
        await pageActions.enterElementText(this.PASSWORD_EDITBOX_ID, password);
        await pageActions.clickElement(this.SIGN_IN_BUTTON_ID);
    }
}
