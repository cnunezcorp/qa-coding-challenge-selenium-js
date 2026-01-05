const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const TinyMCEActions = require('../../../main/js/actions/TinyMCEActions');
const Color = require('../../../main/js/fixtures/Color');
const AllureHelper = require('../../../main/js/utils/AllureHelper');

let tinyMCEActions;
let textoGuardado;

Given('el usuario navega a la pagina de TinyMCE', async function() {
    tinyMCEActions = new TinyMCEActions();
    await tinyMCEActions.navigateToTinyMCEPage();
    await AllureHelper.captureScreenshot('Pagina Principal');
});

When('borra el texto existente en el editor', async function() {
    await tinyMCEActions.borrarTextoDelEditor();
    await AllureHelper.captureScreenshot('Es borrado el texto del editor', await tinyMCEActions.tinyMCEPage.editorIframe);
});

When('escribe el texto {string} en negritas', async function(paramTexto) {
    textoGuardado = tinyMCEActions.generarTextoConFechaHora(paramTexto);
    await tinyMCEActions.escribirTextoEnNegritas(textoGuardado);
    await AllureHelper.captureScreenshot('Texto escrito en negritas', await tinyMCEActions.tinyMCEPage.editorIframe);
});

When('es centrado el texto', async function() {
    await tinyMCEActions.centrarTexto();
    assert(await tinyMCEActions.validarTextoCentrado(), 'El texto no está centrado');
    await AllureHelper.captureScreenshot('El texto escrito es centrado', await tinyMCEActions.tinyMCEPage.editorIframe);
});

When('procede a cambia el color del texto a {string}', async function(colorString) {
    await tinyMCEActions.cambiarColorTexto(obtenerColorDesdeString(colorString));
    await AllureHelper.captureScreenshot(`Color del texto cambiado a ${colorString}`, await tinyMCEActions.tinyMCEPage.editorIframe);
});

function obtenerColorDesdeString(colorString) {
    try {
        return Color.valueOf(colorString.toUpperCase());
    } catch (e) {
        return Color.ROJO;
    }
}

When('se guarda y obtiene el texto del editor', async function() {
    textoGuardado = await tinyMCEActions.obtenerTextoDelEditor();
});

Then('el texto es guardado correctamente en una variable', async function() {
    assert(textoGuardado !== null, 'El texto guardado no debe ser null');
    assert(textoGuardado !== '', 'El texto guardado no debe estar vacío');
    AllureHelper.attachment(`Informacion del texto guardado: ${textoGuardado}`);
});

Then('el texto escrito se encuentra almacenado en la variable', async function() {
    assert(textoGuardado !== null, 'El texto guardado no debe ser null');
    assert(textoGuardado !== '', 'El texto guardado no debe estar vacío');
    console.log('Texto guardado en la variable: ' + textoGuardado);
    await AllureHelper.captureScreenshot(`Validacion del texto guardado en la variable: ${textoGuardado}`, await tinyMCEActions.tinyMCEPage.editorIframe);
    AllureHelper.attachment('Texto almacenado en la variable', textoGuardado);
});

