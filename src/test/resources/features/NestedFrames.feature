@NestedFrames @Regression
Feature: Nested Frames - Obtener Textos

  @Componente @Smoke @Regression
  Scenario: Obtener los textos de los distintos iframes
    Given el usuario navega a la pagina de Nested Frames
    When se obtiene el texto de todos los frames
    And son impresos los textos obtenidos
    Then se deberian haber obtenido textos de los frames correctamente

