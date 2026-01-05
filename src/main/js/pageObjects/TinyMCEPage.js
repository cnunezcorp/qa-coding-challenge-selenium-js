/**
 * Page Object para la pagina TinyMCE.
 *
 * <p>Contiene todos los elementos web de la página como el 
 * editor iframe, botones de formato y opciones de color.</p>
 *
 * @author Cristofer Nuñez
 * @version 1.0
 */
const Browser = require('../config/Browser');
const { By } = require('selenium-webdriver');

class TinyMCEPage {
    constructor() { }

    get driver() {
        return Browser.getWebDriver();
    }

    get editorIframe() {
        return this.driver.findElement(By.xpath("//iframe[contains(@id, 'mce_')]"));
    }

    get boldButton() {
        return this.driver.findElement(By.xpath("//button[contains(@aria-label, 'Bold') or @title='Bold']"));
    }

    get alignCenterButton() {
        return this.driver.findElement(By.xpath("//button[contains(@aria-label, 'Align center') or @title='Align center']"));
    }

    get textColorButton() {
        return this.driver.findElement(By.xpath("//button[contains(@aria-label, 'Text color') or @title='Text color']"));
    }

    get redColorOption() {
        return this.driver.findElement(By.xpath("//div[@role='listbox']//div[@role='option' or @role='menuitem'][contains(@style, 'rgb(204, 0, 0)') or contains(@style, '#cc0000')]"));
    }

    get editorBody() {
        return this.driver.findElement(By.xpath("//body[@id='tinymce']"));
    }

    get closeBannerButton() {
        return this.driver.findElement(By.xpath("//button[contains(@aria-label, 'Close') or contains(@title, 'Close') or contains(@class, 'close')]"));
    }

    get notificationCloseButton() {
        return this.driver.findElement(By.xpath("//div[contains(@class, 'tox-notification')]//button[contains(@aria-label, 'Close') or @title='Close' or contains(@class, 'tox-button--icon')]"));
    }

    get bannerCloseButton() {
        return this.driver.findElement(By.xpath("//div[contains(@class, 'tox-notification')]//button | //button[contains(@aria-label, 'Close') or contains(@title, 'Close')]"));
    }
}

module.exports = TinyMCEPage;

