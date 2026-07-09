import fs from 'fs';
import * as CryptoJS from 'crypto-js';
import type { Page } from '@playwright/test';
import { BrowserContext, expect } from '@playwright/test';
import { Workbook } from 'exceljs';
import { testConfig } from '../testConfig';
import path from 'path';
const waitForElement = Number(testConfig.waitForElement);

export class PageActions {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToURL() {
        await this.page.goto("");
    }

    async decipherPassword(): Promise<string> {
        const key = `SECRET`;
        //ENCRYP
        // const cipher = CryptoJS.AES.encrypt('demouat',key);
        // console.log(cipher.toString());
        return CryptoJS.AES.decrypt(testConfig.password, key).toString(CryptoJS.enc.Utf8);
    }

    async waitForPageNavigation(event: string): Promise<void> {
        switch (event.toLowerCase()) {
            case `networkidle`:
                await this.page.waitForNavigation({ waitUntil: `networkidle`, timeout: waitForElement });
                break;
            case `load`:
                await this.page.waitForNavigation({ waitUntil: `load`, timeout: waitForElement });
                break;
            case `domcontentloaded`:
                await this.page.waitForNavigation({ waitUntil: `domcontentloaded`, timeout: waitForElement });
        }
    }

    async delay(time: number): Promise<void> {
        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        });
    }

    async clickElement(locator: string): Promise<void> {
        await this.page.locator(locator).click();
    }

    async clickElementJS(locator: string): Promise<void> {
        await this.page.locator(locator).evaluate((element: HTMLElement) => element.click());
    }

    async boundingBoxClickElement(locator: string): Promise<void> {
        await this.delay(1000);
        const element = this.page.locator(locator);
        await element.waitFor({ state: 'visible' });
        const box = await element.boundingBox();
        if (!box) {
            throw new Error(`Unable to get bounding box for: ${locator}`);
        }
        await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }

    async enterElementText(locator: string, text: string): Promise<void> {
        await this.page.locator(locator).fill(text);
    }

    async dragAndDrop(dragElementLocator: string, dropElementLocator: string): Promise<void> {
        await this.page.locator(dragElementLocator).dragTo(this.page.locator(dropElementLocator));
    }

    async selectOptionFromDropdown(locator: string, option: string): Promise<void> {
        await this.page.locator(locator).selectOption(option);
    }

    async getTextFromWebElements(locator: string): Promise<string[]> {
        return this.page.locator(locator).allTextContents();
    }

    async downloadFile(locator: string): Promise<string> {
        const downloadPromise = this.page.waitForEvent(`download`);
        await this.page.locator(locator).click();
        const download = await downloadPromise;
        await download.saveAs(path.join(__dirname, `../Downloads`, download.suggestedFilename()));
        return download.suggestedFilename();
    }

    async keyPress(locator: string, key: string): Promise<void> {
        await this.page.locator(locator).press(key);
    }

    async readDataFromExcel(fileName: string, sheetName: string, rowNum: number, cellNum: number): Promise<string> {
        const workbook = new Workbook();
        return workbook.xlsx.readFile(`./Downloads/${fileName}`).then(function () {
            const sheet = workbook.getWorksheet(sheetName);
            return sheet.getRow(rowNum).getCell(cellNum).toString();
        });
    }

    async readValuesFromTextFile(filePath: string): Promise<string> {
        return fs.readFileSync(`${filePath}`, `utf-8`);
    }

    async writeDataIntoTextFile(filePath: number | fs.PathLike, data: string | NodeJS.ArrayBufferView): Promise<void> {
        fs.writeFile(filePath, data, (error) => {
            if (error)
                throw error;
        });
    }

    async verifyElementText(locator: string, text: string): Promise<void> {
        const textValue = await this.page.locator(locator).textContent();
        if (textValue === null) {
            throw new Error(`Element text not found: ${locator}`);
        }
        expect(textValue.trim()).toBe(text);
    }


    async verifyNewWindowUrlAndClick(context: BrowserContext, newWindowLocator: string, urlText: string,clickOnNewWindowLocator:string): Promise<void> {
        const newPagePromise = context.waitForEvent('page');
        await this.page.locator(newWindowLocator).click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        expect(newPage.url()).toContain(urlText);
        await newPage.locator(clickOnNewWindowLocator).click();
        await newPage.close();
    }

    async verifyElementContainsText(locator: string, text: string): Promise<void> {
        await expect(this.page.locator(locator)).toContainText(text);
    }

    async verifyJSElementValue(locator: string, text: string): Promise<void> {
        const textValue = await this.page.locator(locator).evaluate((element: HTMLInputElement) => element.value);
        expect(textValue.trim()).toBe(text);
    }

    async verifyElementAttribute(locator: string, attribute: string, value: string): Promise<void> {
        const textValue = await this.page.locator(locator).getAttribute(attribute);
        if (textValue === null) {
            throw new Error(`Attribute not found: ${attribute} on ${locator}`);
        }
        expect(textValue.trim()).toBe(value);
    }

    async verifyElementIsDisplayed(locator: string, errorMessage: string): Promise<void> {
        await this.page.locator(locator).waitFor({ state: `visible`, timeout: waitForElement })
            .catch(() => { throw new Error(`${errorMessage}`); });
    }

    async expectToBeTrue(status: boolean, errorMessage: string): Promise<void> {
        expect(status, `${errorMessage}`).toBe(true);
    }

    async expectToBeValue(expectedValue: string, actualValue: string, errorMessage: string): Promise<void> {
        expect(expectedValue.trim(), `${errorMessage}`).toBe(actualValue);
    }
}