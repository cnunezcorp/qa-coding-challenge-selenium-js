/**
 * Acciones para interactuar con la pagina TinyMCE.
 *
 * <p>Contiene metodos para escribir texto en negritas, centrar texto, cambiar colores
 * y validar los estilos aplicados.</p>
 *
 * @author Cristofer Nuñez
 * @version 1.0
 */
const BasePage = require('../pageObjects/BasePage');
const TinyMCEPage = require('../pageObjects/TinyMCEPage');
const Color = require('../fixtures/Color');
const Environment = require('../fixtures/Environment');

class TinyMCEActions extends BasePage {
    constructor() {
        super();
        this.tinyMCEPage = new TinyMCEPage();
    }

    // Navega a la pagina de TinyMCE y cierra el banner que se muestra cuando se carga la pagina.
    async navigateToTinyMCEPage() {
        await this.driver.get(`${Environment.getBaseUrl()}/tinymce`);
        await this.hacerClickConEspera(() => this.tinyMCEPage.bannerCloseButton);
    }


    // Borra todo el contenido del editor.
    async borrarTextoDelEditor() {
        await this.volverAlContenidoPrincipal();
        await this.wait.until(async () => {
            return await this.driver.executeScript('return tinymce.activeEditor != null');
        });
        await this.driver.executeScript("tinymce.activeEditor.setContent('')");
    }

    /**
     * Escribe texto en negritas en el editor.
     * @param {string} texto El texto a escribir
     */
    async escribirTextoEnNegritas(texto) {
        await this.volverAlContenidoPrincipal();
        await this.wait.until(async () => {
            return await this.driver.executeScript('return tinymce.activeEditor != null');
        });
        await this.driver.executeScript(`tinymce.activeEditor.insertContent('<strong>${texto}</strong>')`);
    }

    // Centra el texto en el editor.
    async centrarTexto() {
        await this.volverAlContenidoPrincipal();
        await this.driver.executeScript(
            'var editor = tinymce.activeEditor; ' +
            'var content = editor.getContent(); ' +
            'editor.setContent(\'<div style="text-align: center;">\' + content + \'</div>\')'
        );
    }

    /**
     * Cambia el color del texto en el editor.
     * @param {Color} color El color a aplicar
     */
    async cambiarColorTexto(color) {
        await this.volverAlContenidoPrincipal();
        const colorHex = color.getCodigoHex();
        await this.driver.executeScript(
            `var editor = tinymce.activeEditor; ` +
            `var body = editor.getBody(); ` +
            `body.style.color = '${colorHex}'; ` +
            `var elements = body.getElementsByTagName('*'); ` +
            `for (var i = 0; i < elements.length; i++) { ` +
            `  elements[i].style.color = '${colorHex}' ` +
            `}`
        );
    }

    /**
     * Obtiene el texto visible del editor
     * @returns {Promise<string>} El texto visible del editor
     */
    async obtenerTextoDelEditor() {
        const iframe = await this.tinyMCEPage.editorIframe;
        await this.cambiarAIframe(iframe);
        const editorBody = await this.tinyMCEPage.editorBody;
        await this.wait.until(async () => {
            try {
                return await editorBody.isDisplayed() ? editorBody : false;
            } catch (e) {
                return false;
            }
        });
        const texto = await editorBody.getText();
        await this.volverAlContenidoPrincipal();
        return texto;
    }

    /**
     * Obtiene el HTML completo del contenido del editor.
     * @returns {Promise<string>} El HTML del editor
     */
    async obtenerHtmlDelEditor() {
        const iframe = await this.tinyMCEPage.editorIframe;
        await this.cambiarAIframe(iframe);
        const editorBody = await this.tinyMCEPage.editorBody;
        await this.wait.until(async () => {
            try {
                return await editorBody.isDisplayed() ? editorBody : false;
            } catch (e) {
                return false;
            }
        });
        const html = await editorBody.getAttribute('innerHTML');
        await this.volverAlContenidoPrincipal();
        return html;
    }

    /**
     * Valida si el texto está centrado en el editor.
     * @returns {Promise<boolean>} true si está centrado, false en caso contrario
     */
    async validarTextoCentrado() {
        await this.volverAlContenidoPrincipal();
        const textAlign = await this.driver.executeScript(
            'var editor = tinymce.activeEditor; ' +
            'var body = editor.getBody(); ' +
            'var computedStyle = window.getComputedStyle(body); ' +
            'return computedStyle.textAlign === \'center\' || body.style.textAlign === \'center\';'
        );
        const html = await this.obtenerHtmlDelEditor();
        return (textAlign !== null && textAlign.toString() === 'true') || html.includes('text-align: center');
    }

    /**
     * Genera un texto con la fecha y hora actual al final.
     * @param {string} texto El texto base
     * @returns {string} El texto con fecha y hora
     */
    generarTextoConFechaHora(texto) {
        const now = new Date();
        const fechaHora = now.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/, '$1/$2/$3 $4:$5:$6');
        return `${texto} ${fechaHora}`;
    }
}

module.exports = TinyMCEActions;

