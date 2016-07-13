var express   = require('express');
var router    = express.Router();
var webdriver = require('selenium-webdriver');
var browser   = new webdriver
    .Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

var by = webdriver.By


/* GET users listing. */
router.get('/', function(req, res, next) {



    browser.get('http://nelsette.com/qm/upcoming?state=upcoming&currency=KZT&sp=0&ep=374220&ord=0&city=1526384');

    browser.findElement(by.name('qm_wrapper'));

    //browser.getTitle();
    //browser.getTitle();
    browser.findElements(webdriver.By.css('[href^="/wiki/"]')).then(function(links){
        console.log('Found', links.length, 'Wiki links.' )
        browser.quit();
    });

    //.qm_wrapper


    //var data = {};

    //res.json(data);

    res.send('request end');
});

module.exports = router;