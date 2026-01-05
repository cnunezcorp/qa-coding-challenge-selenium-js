/**
 * Acciones para interactuar con la pagina de frames anidados.
 *
 * <p>Permite extraer el texto de todos los frames anidados 
 * recorriendo la estructura de frames e iframes.</p>
 *
 * @author Cristofer Nuñez
 * @version 1.0
 */
const BasePage = require('../pageObjects/BasePage');
const { By } = require('selenium-webdriver');
const Environment = require('../fixtures/Environment');

class NestedFramesActions extends BasePage {
    constructor() {
        super();
        this.textosObtenidos = new Set();
    }

    // Navega a la pagina de frames anidados e inicializa la coleccion de textos.
    async navigateToNestedFramesPage() {
        await this.driver.get(`${Environment.getBaseUrl()}/nested_frames`);
        this.textosObtenidos = new Set();
    }

    /**
     * Obtiene todos los frames del contenido principal.
     * @returns {Promise<Array<WebElement>>} Array de elementos frame e iframe
     */
    async obtenerTodosLosFramesPrincipales() {
        await this.volverAlContenidoPrincipal();
        const frames = await this.driver.findElements(By.tagName('frame'));
        const iframes = await this.driver.findElements(By.tagName('iframe'));
        return [...frames, ...iframes];
    }

    // Extrae el texto de todos los frames.
    async obtenerTextosDeTodosLosFrames() {
        await this.volverAlContenidoPrincipal();
        await this.obtenerTextosFramesRecursivo('Contenido Principal');
    }

    /**
     * Este metodo recorre todos los frames y obtiene sus textos.
     * @param {string} contexto Ruta del contexto actual
     */
    async obtenerTextosFramesRecursivo(contexto) {
        try {
            const cantidadFrames = await this.obtenerCantidadFrames();

            if (cantidadFrames === 0) {
                const texto = await this.obtenerTextoActual();
                if (texto && texto.trim() !== '') {
                    this.textosObtenidos.add(texto.trim());
                }
                return;
            }

            for (let i = 0; i < cantidadFrames; i++) {
                const nombreFrame = await this.obtenerNombreFramePorIndice(i);
                try {
                    await this.driver.switchTo().frame(i);
                    await this.obtenerTextosFramesRecursivo(contexto + ' -> ' + nombreFrame);
                } catch (e) {
                    // Continuar con el siguiente frame
                } finally {
                    try {
                        await this.driver.switchTo().parentFrame();
                    } catch (e) {
                        await this.volverAlContenidoPrincipal();
                    }
                }
            }
        } catch (e) {
            await this.volverAlContenidoPrincipal();
        }
    }

    /**
     * Cuenta la cantidad de frames e iframes en el contexto actual.
     * @returns {Promise<number>} El número total de frames
     */
    async obtenerCantidadFrames() {
        const frames = await this.driver.findElements(By.tagName('frame'));
        const iframes = await this.driver.findElements(By.tagName('iframe'));
        return frames.length + iframes.length;
    }

    /**
     * Obtiene el nombre de un frame por su índice.
     * @param {number} indice El índice del frame
     * @returns {Promise<string>} El nombre del frame o un nombre por defecto
     */
    async obtenerNombreFramePorIndice(indice) {
        const frames = await this.driver.findElements(By.tagName('frame'));
        const iframes = await this.driver.findElements(By.tagName('iframe'));
        const todosLosFrames = [...frames, ...iframes];

        if (indice < todosLosFrames.length) {
            const nombre = await todosLosFrames[indice].getAttribute('name');
            return (nombre && nombre !== '') ? nombre : `frame-${indice}`;
        }
        return `frame-${indice}`;
    }

    /**
     * Obtiene el texto del body del contexto actual.
     * @returns {Promise<string>} El texto del body
     */
    async obtenerTextoActual() {
        const body = await this.driver.findElement(By.tagName('body'));
        return await body.getText();
    }

    /**
     * Obtiene la lista de textos únicos extraídos de los frames.
     * @returns {Array<string>} Lista de textos obtenidos
     */
    getTextosObtenidos() {
        return Array.from(this.textosObtenidos);
    }

    // Imprime los textos obtenidos separados por comas.
    imprimirTextos() {
        console.log('Textos obtenidos: ' + Array.from(this.textosObtenidos).join(', '));
    }
}

module.exports = NestedFramesActions;

