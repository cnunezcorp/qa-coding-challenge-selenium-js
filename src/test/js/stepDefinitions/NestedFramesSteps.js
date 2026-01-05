const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const NestedFramesActions = require('../../../main/js/actions/NestedFramesActions');
const AllureHelper = require('../../../main/js/utils/AllureHelper');

let nestedFramesActions;

Given('el usuario navega a la pagina de Nested Frames', async function() {
    nestedFramesActions = new NestedFramesActions();
    await nestedFramesActions.navigateToNestedFramesPage();
    await AllureHelper.captureScreenshot('Pagina Principal');
});

When('se obtiene el texto de todos los frames', async function() {
    await nestedFramesActions.obtenerTextosDeTodosLosFrames();
    await AllureHelper.captureScreenshot('Se obtienen los textos de los frames', await nestedFramesActions.obtenerTodosLosFramesPrincipales());
});

When('son impresos los textos obtenidos', async function() {
    nestedFramesActions.imprimirTextos();
    const textosStr = nestedFramesActions.getTextosObtenidos().join(', ');
    AllureHelper.attachment('Textos obtenidos de los frames', textosStr);
});

Then('se deberian haber obtenido textos de los frames correctamente', async function() {
    const textos = nestedFramesActions.getTextosObtenidos();
    assert(textos !== null, 'Los textos obtenidos no deben ser null');
    assert(textos.length > 0, 'Los textos obtenidos no deben estar vacíos');
    const textosStr = textos.join(', ');
    await AllureHelper.captureScreenshot('Validacion textos obtenidos: ' + textosStr, await nestedFramesActions.obtenerTodosLosFramesPrincipales());
    AllureHelper.attachment('Validando los textos obtenidos: ', textosStr);
});

