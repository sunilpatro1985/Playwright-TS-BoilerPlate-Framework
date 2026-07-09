import { PageActions } from "@base/PageActions";
import type { Page } from '@playwright/test';

let pageActions: PageActions;
 

export class HomePage{
    readonly page: Page;
    //protected  EMAIL_EDITBOX_ID = `#email`;
  
    constructor(page: Page) {
        this.page = page;
        pageActions = new PageActions(this.page);
    }

}
