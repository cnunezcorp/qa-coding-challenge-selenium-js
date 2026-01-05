/**
 * Esta es la clase base que centraliza funcionalidades en común.
 *
 * <p>Proporciona funcionalidades comunes como clicks, escritura de texto y manejo de iframes
 * para todas las clases que extienden de la misma.</p>
 *
 * @author Cristofer Nuñez
 * @version 1.0
 */
const Browser = require('../config/Browser');
const { until, By } = require('selenium-webdriver');

class BasePage {
    // Los getters obtienen el driver y wait del Singleton cuando se necesitan
    get driver() {
        return Browser.getWebDriver();
    }

    get wait() {
        return Browser.getWait();
    }

    /**
     * Hace clic en un elemento despues de esperar a que sea clickeable.
     * @param {WebElement} element El elemento en el que hacer clic
     */
    async hacerClick(element) {
        await this.wait.until(async () => {
            try {
                const isDisplayed = await element.isDisplayed();
                const isEnabled = await element.isEnabled();
                return isDisplayed && isEnabled ? element : false;
            } catch (e) {
                return false;
            }
        });
        await element.click();
    }

    /**
     * Busca un elemento dentro del wait y hace clic cuando esta disponible.
     * Es mas robusto para elementos que pueden no existir inicialmente en el DOM como los banners.
     * @param {Function} elementGetter Función que retorna el elemento a buscar
     */
    async hacerClickConEspera(elementGetter) {
        const element = await this.wait.until(async () => {
            try {
                const el = await elementGetter();
                const isDisplayed = await el.isDisplayed();
                const isEnabled = await el.isEnabled();
                return isDisplayed && isEnabled ? el : false;
            } catch (e) {
                return false;
            }
        });
        await element.click();
    }

    /**
     * Escribe texto en un elemento despues de limpiarlo.
     * @param {WebElement} element El elemento donde escribir
     * @param {string} text El texto a escribir
     */
    async escribirTexto(element, text) {
        await this.wait.until(async () => {
            try {
                return await element.isDisplayed() ? element : false;
            } catch (e) {
                return false;
            }
        });
        await element.clear();
        await element.sendKeys(text);
    }

    /**
     * Obtiene la URL actual del navegador.
     * @returns {Promise<string>} La URL actual
     */
    async obtenerUrlActual() {
        return await this.driver.getCurrentUrl();
    }

    /**
     * Cambia el contexto del driver a un iframe.
     * @param {WebElement} iframe El elemento iframe al que cambiar
     */
    async cambiarAIframe(iframe) {
        await this.wait.until(async () => {
            try {
                await this.driver.switchTo().frame(iframe);
                return true;
            } catch (e) {
                return false;
            }
        });
    }

    /**
     * Este metodo regresa el contexto del driver al contenido principal fuera de iframes.
     */
    async volverAlContenidoPrincipal() {
        await this.driver.switchTo().defaultContent();
    }
}

module.exports = BasePage;

