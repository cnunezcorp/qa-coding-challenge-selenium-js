/**
 * Clase que extiende WebDriverWait para manejar StaleElementReferenceException.
 *
 * <p>Realiza hasta 3 reintentos cuando se encuentra un StaleElementReferenceException
 * antes de lanzar la excepción final.</p>
 */
const { until } = require('selenium-webdriver');

class RobustWebDriverWait {
    constructor(driver, timeout) {
        this.driver = driver;
        this.timeout = timeout;
    }

    async until(condition) {
        const retries = 3;
        for (let i = 0; i < retries; i++) {
            try {
                return await this.driver.wait(condition, this.timeout);
            } catch (error) {
                const isStaleError = error.name === 'StaleElementReferenceError' || 
                                   (error.message && error.message.includes('stale')) ||
                                   (error.message && error.message.includes('Stale'));
                if (isStaleError && i < retries - 1) {
                    // Espera un poco antes de reintentar
                    await new Promise(resolve => setTimeout(resolve, 500));
                    continue;
                }
                throw error;
            }
        }
    }
}

module.exports = RobustWebDriverWait;

