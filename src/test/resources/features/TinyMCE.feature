@TinyMCE @Regression
Feature: TinyMCE Editor - Edicion de Texto

  @Componente @Smoke @ColorCorrecto
  Scenario: Guardar y recuperar un texto con formato en color rojo
    Given el usuario navega a la pagina de TinyMCE
    When borra el texto existente en el editor
    And escribe el texto "Cristofer Nuñez" en negritas
    And es centrado el texto
    And procede a cambia el color del texto a "ROJO"
    And se guarda y obtiene el texto del editor
    And el texto es guardado correctamente en una variable
    Then el texto escrito se encuentra almacenado en la variable

  @Componente @Smoke @ColorIncorrecto
  Scenario: Guardar y recuperar un texto con formato distinto al color rojo
    Given el usuario navega a la pagina de TinyMCE
    When borra el texto existente en el editor
    And escribe el texto "Color incorrecto" en negritas
    And es centrado el texto
    And procede a cambia el color del texto a "AZUL"
    And se guarda y obtiene el texto del editor
    And el texto es guardado correctamente en una variable
    Then el texto escrito se encuentra almacenado en la variable

