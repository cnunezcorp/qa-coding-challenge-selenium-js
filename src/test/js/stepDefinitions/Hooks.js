/**
 * Hooks  para la configuración de cucumber y limpieza de las pruebas.
 *
 * <p>Esta clase maneja el ciclo de vida de Cucumber como la inicializacion, 
 * la configuracion de Allure Reports captura de screenshots en caso de errores 
 * y la generación de reportes.</p>
 *
 * <p>Incluye hooks para Before, After, BeforeStep, AfterStep y AfterAll
 * que se ejecutan automaticamente durante la ejecucion de los escenarios.</p>
 *
 * @author Cristofer Nuñez
 * @version 1.0
 */

const { Before, After, BeforeStep, AfterStep, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const Browser = require('../../../main/js/config/Browser');
const AllureHelper = require('../../../main/js/utils/AllureHelper');
const Environment = require('../../../main/js/fixtures/Environment');
const Browsers = require('../../../main/js/fixtures/Browsers');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const allureResultsDir = path.join(process.cwd(), 'allure-results');
if (!fs.existsSync(allureResultsDir)) {
    fs.mkdirSync(allureResultsDir, { recursive: true });
}

let currentTestCase = null;
let currentScenario = null;
let selectedBrowserType = null;
let currentEnvironmentType = null;

setDefaultTimeout(60000);

//Obtiene el keyword del step de Gherkin, ya sea GIVEN, WHEN, THEN o AND.
function obtenerKeywordDelStep(step, scenario) {
    if (!step.pickleStep || !scenario?.gherkinDocument) return '';
    
    try {
        const astNodeId = step.pickleStep.astNodeIds?.[0];
        if (!astNodeId) return '';
        
        const allSteps = scenario.gherkinDocument.feature?.children
            ?.flatMap(child => [
                ...(child.scenario?.steps || []),
                ...(child.background?.steps || [])
            ]) || [];
        
        const gherkinStep = allSteps.find(gs => gs.id === astNodeId);
        return gherkinStep?.keyword?.trim().toUpperCase() || '';
    } catch (e) {
        return '';
    }
}

Before({ order: 0 }, async function() {
    if (!Browser.instance?.driver) {
        Browser.getInstance();
    }
});

Before({ order: 1 }, async function(scenario) {
    currentScenario = scenario;
    const scenarioName = scenario.pickle?.name || scenario.name || 'Escenario desconocido';
    const featureName = scenario.gherkinDocument?.feature?.name || 
                        scenario.pickle?.uri?.split('/').pop()?.replace('.feature', '') || 
                        'Feature desconocido';
    
    // Guarda la informacion del browser y environment si aun no esta guardada
    if (!selectedBrowserType || !currentEnvironmentType) {
        const browserInstance = Browser.getInstance();
        selectedBrowserType = browserInstance.getSelectedBrowser();
        currentEnvironmentType = Environment.getCurrentEnvironment();
    }
    
    currentTestCase = {
        uuid: uuidv4(),
        name: scenarioName,
        featureName: featureName,
        start: Date.now()
    };
    AllureHelper.currentTestCase = currentTestCase;
    AllureHelper.clearSteps();
});

BeforeStep(async function(step) {
    const stepText = step.pickleStep?.text || step.text || 'Step desconocido';
    const keyword = obtenerKeywordDelStep(step, currentScenario);
    const formattedStepText = keyword ? `${keyword} ${stepText}` : stepText;
    AllureHelper.startStep(formattedStepText);
});

AfterStep(async function(step) {
    const status = step.result?.status || 'PASSED';
    if (status === 'FAILED') {
        await AllureHelper.captureScreenshot('Error en el paso');
    }
    AllureHelper.endStep(status === 'FAILED' ? 'failed' : 'passed');
});

After(async function(scenario) {
    const status = scenario.result?.status || 'PASSED';
    
    if (currentTestCase) {
        const steps = AllureHelper.getSteps();
        const isFailed = status === 'FAILED';

        const testResult = {
            uuid: currentTestCase.uuid,
            name: currentTestCase.name,
            historyId: currentTestCase.uuid,
            fullName: `${currentTestCase.featureName}: ${currentTestCase.name}`,
            labels: [
                { name: 'package', value: 'features' },
                { name: 'testClass', value: 'Cucumber' },
                { name: 'testMethod', value: currentTestCase.name },
                { name: 'suite', value: currentTestCase.featureName }
            ],
            links: [],
            status: isFailed ? 'failed' : 'passed',
            statusDetails: isFailed ? {
                message: scenario.result?.message || 'Test failed',
                trace: scenario.result?.exception?.stack || ''
            } : undefined,
            stage: 'finished',
            steps: steps.map(step => ({
                uuid: step.uuid,
                name: step.name,
                status: step.status,
                stage: step.stage,
                start: step.start,
                stop: step.stop || Date.now(),
                attachments: (step.attachments || []).map(({ uuid, name, source, type }) => ({
                    uuid, name, source, type
                })),
                steps: step.steps || []
            })),
            attachments: [],
            start: currentTestCase.start,
            stop: Date.now()
        };

        fs.writeFileSync(
            path.join(allureResultsDir, `${currentTestCase.uuid}-result.json`),
            JSON.stringify(testResult, null, 2),
            'utf-8'
        );
        
        currentTestCase = null;
        currentScenario = null;
    }
    
    if (Browser.instance) {
        await Browser.getInstance().quitDriver();
    }
});

AfterAll(async function() {
    /*Crea el archivo environment.properties para Allure y que de esa manera
    se pueda visualizar el ambiente y el navegador utilizado en las pruebas*/
    const currentEnv = currentEnvironmentType || Environment.getCurrentEnvironment();
    const selectedBrowser = selectedBrowserType || Browsers.CHROME;
    
    const environmentContent = `Environment=${currentEnv}\nBrowser=${selectedBrowser}`;
    
    const envFilePath = path.join(allureResultsDir, 'environment.properties');
    fs.writeFileSync(envFilePath, environmentContent, 'utf-8');
});

