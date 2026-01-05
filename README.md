# QA Coding Challenge Técnico - Selenium con JavaScript

## Autor

**Cristofer Nuñez**

## Requisitos

- **Node.js** (versión 16 o superior)
- **Google Chrome**
- **Java JDK** (Requerido para ejecutar Allure)
- **Allure Report** (para generar reportes)    
  - [Guía de instalación oficial](https://allurereport.org/docs/v2/install-for-windows/)

## Instalación

1. **Clonar o descargar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd qa-coding-challenge-selenium-js
   ```

2. **Instalar dependencias del proyecto**
Ejecutar el siguiente comando dentro de la carpeta del proyecto para
instalar todas las dependencias necesarias.
   ```bash
   npm install
   ```

## Ejecución de Pruebas
Todos los scripts se encuentran en el ```package.json```

### Ejecuta todas las pruebas, debido a que, tienen el
tag @Regression y limpia resultados previos
```bash
npm test
```

### Ejecuciones Específicas

```bash
npm run test:tinymce   # Página TinyMCE
npm run test:nested    # Página Nested Frames
npm run test:windows   # Página Windows
npm run test:all       # Ejecuta todo porque ignora los tags
```

## Reportes

El proyecto genera capturas de pantalla automáticas en cada paso para facilitar y hace highlight en el elemento con el que está interactuando.

**Para generar y abrir el reporte en el navegador**
   ```bash
   npm run allure:open
   ```

## Configuración de Entorno

Se pueden usar diferentes navegadores y entornos, sin necesidad de modificar el código

| Variable | Opciones Disponibles      | Por Defecto       |
|----------|---------------------------|-------------------|
| BROWSER  | CHROME, EDGE y EDGE       | CHROME            |
| ENV      | DEV, QA y PROD            | QA                |


**Ejemplos:**
```bash
# PowerShell
$env:BROWSER="FIREFOX"; $env:ENV="QA"; npm test

# CMD
set BROWSER=FIREFOX
set ENV=QA
npm test
```

## Características del Proyecto

- **Page Object Model (POM)**: Separación clara entre páginas y acciones
- **Patrón Singleton**: Gestión única de la instancia del WebDriver
- **Allure Reports**: Reportes visuales con screenshots en cada paso de las pruebas e incluyen el resaltado de elementos
- **RobustWebDriverWait**: Manejo de elementos stale con reintentos
- **BDD con Cucumber**: Escenarios escritos en lenguaje Gherkin para que sean mas entendibles
- **Datos dinámicos**: Uso de fecha y hora actual para evitar inputs estáticos
- **Ejecución en múltiples navegadores**: Soporte para Chrome, Firefox, Edge y Safari
- **Ejecución en múltiples entornos**: DEV, QA y PROD

---

