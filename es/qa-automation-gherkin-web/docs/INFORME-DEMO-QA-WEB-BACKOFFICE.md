# Informe de actividades — Demo de QA web (Gherkin + ejecución automatizada)

**Fecha:** 17 de abril de 2026  
**Contexto:** Prueba de concepto para validar login en entorno de testing del backoffice Prepagas (Angular + Keycloak), sin depender inicialmente de la plataforma Tero ni de API de modelos de pago.

---

## 1. Resumen ejecutivo

Se preparó un flujo de pruebas en lenguaje Gherkin (`.feature`), se automatizó la ejecución con **Playwright** en un proyecto mínimo bajo `es/qa-automation-gherkin-web/e2e/`, y se validaron **dos escenarios**: login exitoso y login rechazado por credenciales inválidas. Ambos pasaron de forma estable en ejecución local.

Mientras no se disponga de clave de proveedor LLM para Tero, el rol de “interpretación y orquestación” del escenario se cubrió con el **agente de Cursor** (diseño del feature, ajustes y generación del spec de Playwright), manteniendo el objetivo de **no escribir step definitions manuales tipo Selenium** en el día a día del equipo (el spec actúa como puente ejecutable alineado al Gherkin).

---

## 2. Alcance

| Incluido | No incluido en esta demo |
|----------|---------------------------|
| Escenarios Gherkin de login (éxito y fallo) | Despliegue productivo de Tero en servidor corporativo |
| Suite Playwright headless + capturas | Integración CI/CD definitiva (GitHub Actions, etc.) |
| Plantilla de variables de entorno para Tero futuro | Consumo de API OpenAI/Azure desde Tero en esta fase |
| Archivo de agente comunitario tipo Tero (`agent.md`) | Pruebas de regresión amplia del backoffice |

---

## 3. Trabajo realizado (paso a paso)

### 3.1. Repositorio y materiales

- Se trabajó sobre el repositorio comunitario **tero-agents** (catálogo de agentes y plantillas).
- Se añadió el agente de ejemplo **QA Automation Gherkin Web** en `es/qa-automation-gherkin-web/` con:
  - `login.feature` (escenarios y `Scenario Outline` con tabla `Examples`).
  - `agent.md` (instrucciones para un futuro uso dentro de Tero con herramienta Browser).

### 3.2. Configuración prevista para Tero (cuando haya API key)

- Se documentó una plantilla en `templates/tero-setup/` (`.env.example` y `README.md`) alineada al repositorio principal [abstracta/tero](https://github.com/abstracta/tero): base de datos, Keycloak local de Tero, URL del front, y variables **`BROWSER_TOOL_PLAYWRIGHT_MCP_URL`** / **`BROWSER_TOOL_PLAYWRIGHT_OUTPUT_DIR`** para la herramienta de navegador.

### 3.3. Sustitución temporal del “cerebro” LLM (Tero) por el agente de Cursor

- **Motivo:** no se contaba con API key de OpenAI (distinta a la suscripción de ChatGPT) ni con recursos locales para ejecutar un modelo grande.
- **Qué se hizo:** el agente de Cursor ayudó a redactar el Gherkin, corregir placeholders (`Scenario Outline` + `Examples`), definir el escenario negativo y generar la suite **Playwright** que materializa los mismos pasos de forma determinista.
- **Límite claro:** Cursor no reemplaza la plataforma Tero (gobierno, catálogo, presupuestos, multiusuario); sí acelera la **PoC técnica** y la documentación.

### 3.4. Descargas e instalación (entorno de pruebas Playwright)

En el directorio `es/qa-automation-gherkin-web/e2e/`:

1. `npm install` — instala `@playwright/test`.
2. `npx playwright install chromium` — descarga el navegador Chromium usado en headless.
3. `npm test` — ejecuta los tests definidos en `login.smoke.spec.ts`.

**Nota:** el navegador corre en modo **headless** (sin ventana), salvo que se use `npm run test:headed`.

### 3.5. Ajustes de evidencia (capturas)

- Se configuró `screenshot: "on"` en `playwright.config.ts` para conservar captura al final de cada test (éxito y fallo).
- En el caso de **login exitoso**, se añadió una espera mínima de **5 segundos desde el clic en “Sign in”** antes de cerrar el test, para que la captura refleje mejor la carga del frontend tras el redirect OIDC.

### 3.6. Resultados de las pruebas

| Test | Descripción breve | Resultado |
|------|-------------------|-------------|
| Login exitoso | Usuario `admin` / contraseña válida; redirección a la app sin error de Keycloak | **Pass** |
| Login rechazado | Contraseña inválida; mensaje de error de autenticación visible | **Pass** |

Los artefactos por defecto se escriben en:

- `e2e/test-results/` — incluye PNG `test-finished-*.png` por test.
- `e2e/playwright-report/` — informe HTML interactivo (tras cada ejecución con reporter HTML).

---

## 4. Dónde está el reporte HTML y por qué a veces “no se ve”

- El informe **sí se guarda en disco** al terminar `npm test`; **no** depende de que el proceso siga corriendo.
- Las carpetas `playwright-report/` y `test-results/` están en el **`.gitignore`** del folder `e2e/`. Muchos IDEs **ocultan** archivos ignorados, por eso puede parecer que “no existen” hasta que se habilita “mostrar archivos ignorados” o se navega por terminal / explorador de archivos.

### 4.1. Cómo ver el reporte HTML

Desde `es/qa-automation-gherkin-web/e2e/`:

```bash
npm run report
```

O abrir manualmente el archivo:

`playwright-report/index.html`

### 4.2. Cómo guardar una copia archivada (recomendado para Confluence / adjunto)

```bash
cd es/qa-automation-gherkin-web/e2e
npm test
npm run report:archive
```

Se crea una carpeta con marca de tiempo bajo `e2e/informes-archivados/<marca-de-tiempo>/` con copia de `playwright-report/` y `test-results/`. Esa carpeta se puede **comprimir en ZIP** y adjuntar a Confluence o subir a un drive interno.

---

## 5. Cómo llevar este documento a Confluence o PDF

1. **Confluence:** pegar el contenido de este archivo Markdown (o importar vía “Insertar” → “Marcado” si la instancia lo permite) y ajustar títulos/estilos.
2. **PDF:** abrir este `.md` en un editor que exporte a PDF (por ejemplo VS Code con extensión Markdown PDF), o usar Pandoc si está instalado en la organización:

   ```bash
   pandoc INFORME-DEMO-QA-WEB-BACKOFFICE.md -o INFORME-DEMO-QA-WEB-BACKOFFICE.pdf
   ```

3. **Evidencia gráfica:** adjuntar el ZIP generado desde `informes-archivados/` o capturas puntuales de `test-results/`.

---

## 6. Próximos pasos sugeridos

1. Obtener API key o contrato Azure/OpenAI acotado para activar Tero con límite de gasto (`MONTHLY_USD_LIMIT_DEFAULT` en plantilla `.env`).
2. Importar el agente `es/qa-automation-gherkin-web` en Tero y ejecutar el mismo `login.feature` con la herramienta Browser (sin mantener selectores frágiles a mano en el día a día).
3. Integrar `npm test` en pipeline CI con publicación del artefacto `playwright-report` (subida como artifact de job).

---

## 7. Referencias

- Plataforma Tero: [https://github.com/abstracta/tero](https://github.com/abstracta/tero)  
- Catálogo de agentes: [https://github.com/abstracta/tero-agents](https://github.com/abstracta/tero-agents)  
- Aplicación bajo prueba (entorno testing): [https://prepagas-backoffice-testing.bqmtest.com.uy](https://prepagas-backoffice-testing.bqmtest.com.uy)  

---

*Documento generado para comunicación interna. Los datos de prueba utilizados corresponden a un entorno de testing; no incluir credenciales reales en versiones públicas.*
