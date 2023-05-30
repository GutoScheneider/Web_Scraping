const puppeteer = require("puppeteer");

const url = 'https://www.mercadolivre.com.br/';
const search = 'Hb20';

(async () => {
    const broswer = await puppeteer.launch({ headless: false});
    const page = await broswer.newPage();
    await page.goto(url);
    await page.waitForSelector('#cb1-edit');
    await page.type("#cb1-edit", search);
    await Promise.all([page.waitForNavigation(), page.click(".nav-search-btn")]);
    const links = await page.$$eval(".ui-search-result__image > a", (el) =>
    el.map((link) => link.href));
    
    for(const link of links) {
        await page.goto(link);
        await page.waitForSelector(".ui-pdp-title");
        
        const title = await page.$eval(
            ".ui-pdp-title", 
            (element) => element.innerText
        );
        
        const price = await page.$eval(
            ".andes-money-amount__fraction",
            (element) => element.innerText
        );

        const km = await page.$eval(
            ".ui-pdp-price-comparison__legend",
            (element) => element.innerText
        );
        
        const myResult = {title, price, km};
        console.log(myResult);
    }

    await broswer.close();

})();