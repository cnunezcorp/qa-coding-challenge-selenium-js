/**
 * Enum utilizada para representar los diferentes ambientes disponibles.
 *
 * <p>Cada ambiente contiene su URL base</p>
 *
 * @author Cristofer Nuñez
 * @version 1.0
 */
class Environment {
    static DEV = 'DEV';
    static QA = 'QA';
    static PROD = 'PROD';

    static environmentUrls = {
        [Environment.DEV]: 'https://the-internet.herokuapp.com',
        [Environment.QA]: 'https://the-internet.herokuapp.com',
        [Environment.PROD]: 'https://the-internet.herokuapp.com'
    };

    static getCurrentEnvironment() {
        return process.env.ENV || process.env.ENVIRONMENT || Environment.QA;
    }

    static getBaseUrl() {
        const env = Environment.getCurrentEnvironment();
        return Environment.environmentUrls[env] || Environment.environmentUrls[Environment.QA];
    }
}

module.exports = Environment;
