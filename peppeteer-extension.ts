const puppeteer = require('puppeteer');

import { Page, Browser } from 'puppeteer';
import * as cheerio from 'cheerio';

export class PuppeteerExtension {
    browser: Browser;
    page: Page;
    constructor() {

    }
    set(browser, page) {
        this.browser = browser;
        this.page = page;
    }
    async html() {
        const html: any = await this.page.$eval('html', (html: any) => html.outerHTML); // HTML 얻기
        const $html = cheerio.load(html)('html');
        return $html;
    }
}