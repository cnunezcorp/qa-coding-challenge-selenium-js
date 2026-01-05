@Windows @Regression
Feature: Windows - Manejo de Ventanas

  @Componente @Smoke
  Scenario: Abrir una nueva ventana y obtener el texto mostrado
    Given el usuario navega a la pagina principal
    When hace clic en el enlace para abrir una nueva ventana
    And se cierra la pestaña anterior
    And se captura el texto de la nueva ventana
    And es impreso el texto obtenido
    Then el mensaje mostrado debe ser "New Window"

