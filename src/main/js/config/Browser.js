/**
 * Clase para gestionar la instancia del navegador WebDriver.
 *
 * <p>Proporciona una única instancia del WebDriver y su wait asociado,
 * configurando el navegador seleccionado con opciones optimizadas para pruebas.</p>
 *
 * @author Cristofer Nuñez
 * @version 1.0
 */
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');
const RobustWebDriverWait = require('../utils/RobustWebDriverWait');
const Browsers = require('../fixtures/Browsers');

class Browser {
    constructor() {
        if (Browser.instance) {
            return Browser.instance;
        }
        
        const browserType = this.getBrowserType();
        this.driver = this.createDriver(browserType);
        this.wait = new RobustWebDriverWait(this.driver, 20000);
        this.selectedBrowser = browserType;
        Browser.instance = this;
    }

    /**
     * Obtiene el tipo de navegador desde variable de entorno o usa Chrome por defecto.
     */
    getBrowserType() {
        const browserEnv = process.env.BROWSER || process.env.BROWSER_TYPE || Browsers.CHROME;
        return browserEnv.toUpperCase();
    }

    /**
     * Crea el driver según el navegador seleccionado.
     */
    createDriver(browserType) {
        const builder = new Builder();
        
        switch (browserType) {
            case Browsers.FIREFOX:
                const firefoxOptions = new firefox.Options();
                firefoxOptions.addArguments('-private');
                return builder.forBrowser('firefox').setFirefoxOptions(firefoxOptions).build();
            
            case Browsers.EDGE:
                const edgeOptions = new edge.Options();
                edgeOptions.addArguments('--start-maximized');
                edgeOptions.addArguments('--inprivate');
                return builder.forBrowser('MicrosoftEdge').setEdgeOptions(edgeOptions).build();
            
            case Browsers.CHROME:
            default:
                const chromeOptions = new chrome.Options();
                chromeOptions.addArguments('--start-maximized');
                chromeOptions.addArguments('--incognito');
                chromeOptions.addArguments('--remote-allow-origins=*');
                return builder.forBrowser('chrome').setChromeOptions(chromeOptions).build();
        }
    }

    /**
     * Obtiene el navegador seleccionado.
     */
    getSelectedBrowser() {
        return this.selectedBrowser || this.getBrowserType();
    }

    static getInstance() {
        if (!Browser.instance) {
            new Browser();
        }
        return Browser.instance;
    }

    static getWebDriver() {
        if (!Browser.instance) {
            Browser.getInstance();
        }
        return Browser.instance.driver;
    }

    static getWait() {
        const browser = Browser.getInstance();
        browser.wait = new RobustWebDriverWait(browser.driver, 20000);
        return browser.wait;
    }

    async quitDriver() {
        if (this.driver) {
            try {
                await this.driver.quit();
            } catch (error) {
                console.log('El driver ya estaba cerrado o se produjo un error al cerrarlo.:', error.message);
            }
        }
        Browser.instance = null;
    }
}

module.exports = Browser;

