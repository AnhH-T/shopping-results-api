const puppeteer = require("puppeteer");

const searchImage = async (searchQuery) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("http://images.google.com/", { waitUntil: "networkidle2" });
  await page.click('[class="tdPRye"]');
  await page.type('[name="image_url"]', searchQuery);
  await page.click('[class="gbqfb LIlUb"] ');
  await page.waitForNavigation();
  await page.click('path[d^="M21.11"]');
  await page.waitForNavigation();

  const shopResults = await page.evaluate(() => {
    const listCount = Array.from(
      document.querySelectorAll('div[class^="sh-dlr__list-result"]')
    ).length;
    const gridCount = Array.from(
      document.querySelectorAll('div[class^="sh-dgr__gr"]')
    ).length;
    let listView = false;
    let gridView = false;
    let totalSearchResults = 0;
    if (listCount >= gridCount) {
      listView = true;
      totalSearchResults = listCount;
    } else {
      gridView = true;
      totalSearchResults = gridCount;
    }
    let productsList = [];
    let cap = 6;

    if (totalSearchResults < 5)
      if (totalSearchResults < 0) return console.error();
      else cap = totalSearchResults;

    for (let i = 1; i < cap; i++) {
      let product = {
        name: "",
        store: "",
        price: "",
        url: "",
      };
      if (listView) {
        let rawName = document.querySelectorAll(
          'div[class="sh-dlr__list-result"] .OzIAJc'
        )[i];
        product.name = rawName ? rawName.innerText : "";

        let rawStore = document.querySelectorAll(
          'div[class="sh-dlr__list-result"] .b07ME.mqQL1e'
        )[i];
        product.store = rawStore ? rawStore.innerText : "";

        let rawPrice = document.querySelectorAll(
          'div[class="sh-dlr__list-result"] .a8Pemb'
        )[i];
        product.price = rawPrice ? rawPrice.innerText : "";

        let rawUrl = document.querySelectorAll(
          'div[class="sh-dlr__list-result"] .VZTCjd.translate-content'
        )[i];
        product.url = rawUrl ? rawUrl.href : "";

        productsList = productsList.concat(product);
      }
      if (gridView) {
        let rawName = document.querySelectorAll(
          'div[class^="sh-dgr__gr"] .A2sOrd'
        )[i - 1];
        product.name = rawName ? rawName.innerText : "";

        let rawStore = document.querySelectorAll(
          'div[class^="sh-dgr__gr"] .aULzUe.IuHnof'
        )[i - 1];
        product.store = rawStore ? rawStore.innerText : "";

        let rawPrice = document.querySelectorAll(
          'div[class^="sh-dgr__gr"] .a8Pemb'
        )[i - 1];
        product.price = rawPrice ? rawPrice.innerText : "";

        let rawUrl = document.querySelectorAll(
          'div[class^="sh-dgr__gr"] .eaGTj.mQaFGe.shntl'
        )[i - 1];
        product.url = rawUrl ? rawUrl.href : "";

        productsList = productsList.concat(product);
      }
    }

    return productsList;
  });

  await browser.close();
  return shopResults;
};

module.exports = searchImage;
