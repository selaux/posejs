posejs
=======

Page object oriented selenium-webdriver library for node. ATM in a concept phase...

[![Build Status](https://travis-ci.org/selaux/posejs.png)](https://travis-ci.org/selaux/posejs)
[![Build Status](https://david-dm.org/selaux/posejs.png)](https://david-dm.org/selaux/posejs)

How its supposed to look like in the end:

```javascript
var assert = require('assert'),
    pose = require('pose'),
    PoseDriver = pose.Driver,
    pageModule = pose.pageModule,
    pageObject = pose.pageObject,
    SearchResult,
    GooglePage;

SearchResult = pageModule({
    content: {
        headLine: 'h3',
        link: 'cite',
        shortText: 'span.st'
    }
});

GooglePage = pageObject({

    url: 'http://www.google.com',

    content: {
        searchInput: 'input[name="q"]',
        submitButton: function () {
            return this.$('button[name="btnK"], button[name="btnG"]').find(function (b) {
                return b.isDisplayed();
            });
        },
        searchResults: {
            selector: '#ires ol li',
            wait: true,
            module: SearchResult
        }
    }
});

var driver = new PoseDriver({
    server: 'http://localhost:4444/wd/hub',
    capabilities: [
        posen.Capabilities.chrome()
    ]
});

driver.to(GooglePage);
driver.page.searchInput().value('Wikipedia');
driver.page.submitButton().click();
driver.page.searchResults().get(0).getText().then(function (val) {
    assert.equal(val, 'www.wikipedia.org');
});
driver.quit();
```
