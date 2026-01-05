const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const WindowsActions = require('../../../main/js/actions/WindowsActions');
const AllureHelper = require('../../../main/js/utils/AllureHelper');

let windowsActions;

Given('el usuario navega a la pagina principal', async function() {
    windowsActions = new WindowsActions();
    await windowsActions.navigateToWindowsPage();
    await AllureHelper.captureScreenshot('Pagina Principal');
});

When('hace clic en el enlace para abrir una nueva ventana', async function() {
    await windowsActions.hacerClicEnEnlace();
    await AllureHelper.captureScreenshot('Se hace clic en el texto "Click Here" para abrir una nueva ventana', await windowsActions.windowsPage.clickHereLink);
});

When('se cierra la pestaña anterior', async function() {
    await windowsActions.cambiarANuevaVentanaYCerrarAnterior();
    await AllureHelper.captureScreenshot('Ventana anterior cerrada');
});

When('se captura el texto de la nueva ventana', async function() {
    await windowsActions.obtenerTextoDeNuevaVentana();
    await AllureHelper.captureScreenshot('Texto capturado de la nueva ventana', await windowsActions.windowsPage.textoNuevaVentana);
    AllureHelper.attachment('Texto capturado', windowsActions.getTextoNuevaVentana());
});

When('es impreso el texto obtenido', async function() {
    windowsActions.imprimirTexto();
    AllureHelper.attachment('Texto obtenido de la nueva ventana', windowsActions.getTextoNuevaVentana());
});

Then('el mensaje mostrado debe ser {string}', async function(mensaje) {
    const textoObtenido = windowsActions.getTextoNuevaVentana();
    assert(textoObtenido !== null, 'El texto obtenido no debe ser null');
    assert(textoObtenido.includes(mensaje), `El texto obtenido '${textoObtenido}' debe contener '${mensaje}'`);
    await AllureHelper.captureScreenshot(`Validando el texto obtenido: ${textoObtenido}`, await windowsActions.windowsPage.textoNuevaVentana);
});

