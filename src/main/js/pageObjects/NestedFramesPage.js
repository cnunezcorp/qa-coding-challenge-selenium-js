/**
 * Page Object para la pagina de frames.
 *
 * <p>Esta pagina no tiene elementos estaticos definidos ya que los frames se manejan
 * dinamicamente mediante metodos en las clases de acciones.</p>
 *
 * @author Cristofer Nuñez
 * @version 1.0
 */
const Browser = require('../config/Browser');

class NestedFramesPage {
    constructor() { }

    get driver() {
        return Browser.getWebDriver();
    }
}

module.exports = NestedFramesPage;

