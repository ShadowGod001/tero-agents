Feature: Login de usuario en Prepagas Backoffice
  Como usuario autenticado
  Quiero iniciar sesion en el backoffice
  Para acceder al panel principal

  Background:
    Given que navego a "https://prepagas-backoffice-testing.bqmtest.com.uy"

  @smoke @login
  Scenario Outline: Login exitoso con credenciales validas
    When completo el campo "username" con "<usuario>"
    And completo el campo "password" con "<contrasena>"
    And hago click en "Sign in"
    Then deberia ver el dashboard principal
    And no deberia ver mensajes de error de autenticacion

    Examples:
      | usuario | contrasena |
      | admin   | admin      |

  @smoke @login @negative
  Scenario Outline: Login rechazado con credenciales invalidas
    When completo el campo "username" con "<usuario>"
    And completo el campo "password" con "<contrasena>"
    And hago click en "Sign in"
    Then deberia ver un mensaje de error de autenticacion

    Examples:
      | usuario | contrasena          |
      | admin   | clave-invalida-123 |
