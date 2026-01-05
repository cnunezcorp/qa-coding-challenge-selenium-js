/**
 * Acciones para manejar multiples ventanas del navegador.
 *
 * <p>Permite abrir nuevas ventanas, cambiar entre ellas, cerrar ventanas
 * y obtener el contenido de las ventanas abiertas.</p>
 *
 * @author Cristofer Nuñez
 * @version 1.0
 */
const BasePage = require('../pageObjects/BasePage');
const WindowsPage = require('../pageObjects/WindowsPage');
const Environment = require('../fixtures/Environment');

class WindowsActions extends BasePage {
    constructor() {
        super();
        this.windowsPage = new WindowsPage();
        this.textoNuevaVentana = null;
    }

    // Navega a la pagina principal.
    async navigateToWindowsPage() {
        await this.driver.get(`${Environment.getBaseUrl()}/windows`);
    }

    // Hace clic en el enlace "Click Here" para abrir una nueva ventana.
    async hacerClicEnEnlace() {
        await this.hacerClick(await this.windowsPage.clickHereLink);
    }

    // Cambia a la nueva ventana y cierra la ventana anterior.
    async cambiarANuevaVentanaYCerrarAnterior() {
        const ventanaPrincipal = await this.driver.getWindowHandle();
        const todasLasVentanas = await this.driver.getAllWindowHandles();

        for (const ventana of todasLasVentanas) {
            if (ventana !== ventanaPrincipal) {
                await this.driver.switchTo().window(ventanaPrincipal);
                await this.driver.close();
                await this.driver.switchTo().window(ventana);
                break;
            }
        }
    }

    // Obtiene el texto de la nueva ventana.
    async obtenerTextoDeNuevaVentana() {
        const textoElement = await this.windowsPage.textoNuevaVentana;
        await this.wait.until(async () => {
            try {
                return await textoElement.isDisplayed() ? textoElement : false;
            } catch (e) {
                return false;
            }
        });
        this.textoNuevaVentana = await textoElement.getText();
    }

    // Imprime el texto obtenido de la nueva ventana.
    imprimirTexto() {
        console.log('Texto obtenido: ' + this.textoNuevaVentana);
    }

    /**
     * Obtiene el texto de la nueva ventana.
     * @returns {string} El texto obtenidode la nueva ventana
     */
    getTextoNuevaVentana() {
        return this.textoNuevaVentana;
    }
}

module.exports = WindowsActions;

