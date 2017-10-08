const puppeteer = require('puppeteer');

import { Page, Browser } from 'puppeteer';
import * as cheerio from 'cheerio';

export class PuppeteerExtension {
    browser: Browser;
    page: Page;

    ua = {
        firefox: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0",
        chrome: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
    };
    

    constructor() {

    }

    firefox() {
        this.page.setUserAgent(this.ua.firefox);
    }
    chrome() {
        this.page.setUserAgent(this.ua.chrome);
    }

    /**
     * puppeteer 의 browser 와 page 객체를 저장한다.
     */
    set(browser, page) {
        this.browser = browser;
        this.page = page;
    }
    /**
     * 현재 페이지의 HTML 을 cheeario 객체로 리턴한다.
     * 
     * @code
            async getHtmlTitle() {
                const $html = await this.html();
                console.log('html title: ', $html.find('title').text())
            }
     * @endcode
     */
    async html() {
        const html: any = await this.page.$eval('html', (html: any) => html.outerHTML); // HTML 얻기
        const $html = cheerio.load(html)('html');
        return $html;
    }


    /**
     * 입력 박스에 글을 입력한다.
     * 주의: 에러 검사를 하지 않는다.
     * @param selector selector
     * @param text 입력할 글 내용
     */
    async insert( selector, text ) {
        await this.page.waitFor(100);
        await this.page.focus( selector );
        await this.page.waitFor(100);
        await this.page.type( text );
        await this.page.waitFor(100);
    }

    
    /**
     * Returns a promise of number indicating which selector has been appeared.
     * ( 여러 selector 들을 배열로 입력하고 그 중에 하나가 30 초 이내에 나타나면 0 부터 ... 배열.length 값 중 하나를 리턴한다. )
     * 
     * 만약, selector 가 timeout 될 때까지 나타나지 않으면 -1 일 리턴된다.
     * 
     * @return
     *      Promise(-1) - If none of the selectors are appeared.
     *      Promise( 0 ) - If the first selector appeared.
     *      Promise( 1 ) - If the second selector appeared.
     *      Promise( 2 ) - If the third selector appeared.
     *      and so on.
     * 
     * @code
     *      const n = await this.waitAppear( [ '.error', '.home-form-header' ] );
     * @endcode
     * 
     * @code
     
            let url = "https://accounts.kakao.com/login?continue=https://center-pf.kakao.com/signup";
            await this.page.goto( url );
            let re = await this.waitAppear(['#recaptcha_area', '#email', 'input[name="email"]']);
            if ( re === -1 ) protocol.end('fail', 'login page open failed');
            else if ( re === 0 ) protocol.end('fail', 'capture appeared');
            else protocol.send('login page open ok');

     * @endcode
     */
    async waitAppear(selectors: Array<string>, timeout = 30) {
        let $html = null;
        const maxWaitCount = timeout * 1000 / 100;
        for (let i = 0; i < maxWaitCount; i++) {
            await this.page.waitFor(100);
            $html = await this.html();
            for (let i = 0; i < selectors.length; i++) {
                if ($html.find(selectors[i]).length > 0) return i;
            }
        }
        return -1;
    }


    /**
     * Waits until the selector disappears.
     * 
     * @use
     *      - when you do not know what will appear next page,
     *      - you only know that some in this page will disappear if page chages.
     * 
     * @param selector <string> Selector to be disappears.
     * @param timeout timeout. defualt 30 seconds.
     * @return true if disappeared.
     *          false otherwise.
     * 
     * @code
     *     let re = await page.waitDisappear( passwordField );
            if ( re ) {
                console.log("You are NOT in login page");
            }
            else {
                console.log("You are STILL in login page");
            }
            await page.waitFor( 'body' );
     * @endcode
     */
    async waitDisappear(selector: string, timeout = 30) {
        let $html = null;
        let maxWaitCount = timeout * 1000 / 100;
        for (let i = 0; i < maxWaitCount; i++) {
            await this.page.waitFor(100);
            $html = await this.html();
            if ($html.find(selector).length === 0) return true;
        }
        return false;
    }



    /**
     * 
     * @param options options
     * 
     * @code waitUntil( { appear: [], disappear: [], timeout: 30 });
     * 
     */
    async waitUntil( options ) {

    }








}
