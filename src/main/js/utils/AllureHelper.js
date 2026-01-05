/**
 * Helper para gestionar Allure Reports.
 *
 * <p>Proporciona funcionalidades para agregar screenshots, steps y attachments
 * a los reportes de Allure de manera organizada.
 * donde solo se pasa el texto que va a contener el screenshot y automáticamente se obtiene el driver.</p>
 *
 * @author Cristofer Nuñez
 * @version 1.0
 */
const Browser = require('../config/Browser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class AllureHelper {
    static currentTestCase = null;
    static steps = [];
    static currentStepIndex = -1;

    /**
     * Inicia un nuevo step en Allure.
     * @param {string} name Nombre del step
     * @returns {number} Índice del step creado
     */
    static startStep(name) {
        const step = {
            uuid: uuidv4(),
            name: name,
            status: 'passed',
            stage: 'finished',
            start: Date.now(),
            stop: null,
            attachments: [],
            steps: []
        };
        this.steps.push(step);
        this.currentStepIndex = this.steps.length - 1;
        return this.currentStepIndex;
    }

    /**
     * Finaliza el step actual.
     * @param {string} status marca el estado del step
     */
    static endStep(status = 'passed') {
        if (this.currentStepIndex >= 0 && this.currentStepIndex < this.steps.length) {
            this.steps[this.currentStepIndex].status = status;
            this.steps[this.currentStepIndex].stop = Date.now();
            this.currentStepIndex = -1;
        }
    }

    /**
     * Realiza una captura de pantalla y lo guarda en allure-results 
     * y el mismo se vincula al step actual de cucumber.
     * @param {string} name Texto que contendrá el screenshot
     * @param {WebElement|Array<WebElement>} elementOrElements elemento o array de elementos opcional para resaltar
     */
    static async captureScreenshot(name, elementOrElements = null) {
        try {
            const driver = Browser.getWebDriver();
            if (!driver) {
                console.warn('Driver no disponible para capturar screenshot:', name);
                return;
            }

            // Para resaltar los elementos si se pasan por parametro.
            const elements = Array.isArray(elementOrElements) ? elementOrElements : (elementOrElements ? [elementOrElements] : []);
            const originalStyles = [];

            if (elements.length > 0) {
                try {
                    // Resalta todos los elementos si son varios
                    for (const element of elements) {
                        try {
                            const originalStyle = await driver.executeScript(`
                                var element = arguments[0];
                                var originalStyle = {
                                    border: element.style.border,
                                    outline: element.style.outline
                                };
                                element.style.border = '3px solid red';
                                element.style.outline = '2px solid orange';
                                return originalStyle;
                            `, element);
                            originalStyles.push({ element, style: originalStyle });
                        } catch (e) {
                            originalStyles.push({ element, style: null });
                        }
                    }
                } catch (e) {
                    // Si falla el resaltado, continua con el screenshot sin resaltar
                }
            }
            const screenshot = await driver.takeScreenshot();

            // Restaurar estilos originales si se resaltaron
            if (originalStyles.length > 0) {
                for (const { element, style } of originalStyles) {
                    try {
                        if (style) {
                            await driver.executeScript(`
                                var element = arguments[0];
                                var style = arguments[1];
                                element.style.border = style.border || '';
                                element.style.outline = style.outline || '';
                            `, element, style);
                        } else {
                            await driver.executeScript(`
                                var element = arguments[0];
                                element.style.border = '';
                                element.style.outline = '';
                            `, element);
                        }
                    } catch (e) { }
                }
            }
            const screenshotsDir = path.join(process.cwd(), 'allure-results');
            
            if (!fs.existsSync(screenshotsDir)) {
                fs.mkdirSync(screenshotsDir, { recursive: true });
            }

            const uuid = uuidv4();
            const attachmentFileName = `${uuid}-attachment.png`;
            const attachmentPath = path.join(screenshotsDir, attachmentFileName);
            
            // Convierte base64 a Buffer para poder guardar el archivo como binario
            const buffer = Buffer.from(screenshot, 'base64');
            fs.writeFileSync(attachmentPath, buffer);
            
            // Verifica que el archivo se haya guardado correctamente
            if (!fs.existsSync(attachmentPath)) {
                console.error(`Error: No se pudo guardar el archivo ${attachmentPath}`);
                return null;
            }

            const attachment = {
                uuid: uuid,
                name: name,
                source: attachmentFileName,
                type: 'image/png'
            };

            // Agrega la imagen al step de cucumber actual
            if (this.currentStepIndex >= 0 && this.currentStepIndex < this.steps.length) {
                // Agrega el attachment de imagen al step de cucumber actual
                this.steps[this.currentStepIndex].attachments.push(attachment);
            } else {
                console.warn(`No hay step activo para el screenshot "${name}". El archivo se guardó pero no se agregará al reporte.`);
            }

            return uuid;
        } catch (error) {
            console.error('Error capturando screenshot:', error.message);
            console.error(error.stack);
            return null;
        }
    }

    /**
     * Agrega un attachment de texto al reporte.
     * @param {string} name Nombre del attachment
     * @param {string} content Contenido del attachment
     */
    static attachment(name, content) {
        try {
            const screenshotsDir = path.join(process.cwd(), 'allure-results');
            if (!fs.existsSync(screenshotsDir)) {
                fs.mkdirSync(screenshotsDir, { recursive: true });
            }

            const uuid = uuidv4();
            const attachmentFileName = `${uuid}-attachment.txt`;
            const attachmentPath = path.join(screenshotsDir, attachmentFileName);
            fs.writeFileSync(attachmentPath, content, 'utf-8');
            
            // Verifica que el archivo se guardó correctamente
            if (!fs.existsSync(attachmentPath)) {
                console.error(`Error: No se pudo guardar el archivo ${attachmentPath}`);
                return null;
            }

            const attachment = {
                uuid: uuid,
                name: name,
                source: attachmentFileName,
                type: 'text/plain'
            };

            if (this.currentStepIndex >= 0 && this.currentStepIndex < this.steps.length) {
                // Agrega el attachment al step de cucumber actual
                this.steps[this.currentStepIndex].attachments.push(attachment);
            } else {
                console.warn(`No hay step activo para el attachment "${name}". El archivo se guardó pero no se agregará al reporte.`);
            }

            return uuid;
        } catch (error) {
            console.error('Error agregando attachment:', error.message);
            console.error(error.stack);
            return null;
        }
    }

    /**
     * Obtiene todos los steps creados y limpia la lista.
     * @returns {Array} Array de steps
     */
    static getSteps() {
        const steps = [...this.steps];
        this.steps = [];
        this.currentStepIndex = -1;
        return steps;
    }

    /**
     * Limpia todos los steps para iniciar un nuevo escenario.
     */
    static clearSteps() {
        this.steps = [];
        this.currentStepIndex = -1;
    }
}

module.exports = AllureHelper;

