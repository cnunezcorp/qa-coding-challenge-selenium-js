/**
 * Page Object para la pagina de Windows.
 *
 * <p>Contiene los elementos web necesarios para manejar multiples ventanas</p>
 *
 * @author Cristofer Nuñez
 * @version 1.0
 */
const Browser = require('../config/Browser');
const { By } = require('selenium-webdriver');

class WindowsPage {
    constructor() { }

    get driver() {
        return Browser.getWebDriver();
    }

    get clickHereLink() {
        return this.driver.findElement(By.xpath("//a[text()='Click Here']"));
    }

    get textoNuevaVentana() {
        return this.driver.findElement(By.xpath("//h3[text()='New Window']"));
    }
}

module.exports = WindowsPage;

