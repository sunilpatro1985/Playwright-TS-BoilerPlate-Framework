import { PageActions } from "@base/PageActions";
import type { Page } from '@playwright/test';

let pageActions: PageActions;
 

export class HomePage{
    readonly page: Page;
    protected  SWAGLABS_TEXT = `.app_logo`; //a dot (.) represents a class name, while a hash (#) represents an ID
  
    constructor(page: Page) {
        this.page = page;
        pageActions = new PageActions(this.page);
    }

    async waitforSwaglabsHomePage() {
        await pageActions.verifyElementContainsText(this.SWAGLABS_TEXT, "Swag Labs");
    }

}
