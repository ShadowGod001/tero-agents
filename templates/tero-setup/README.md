# Setup de Tero para QA Automation

## 1) Clonar Tero (motor principal)

```bash
git clone https://github.com/abstracta/tero.git
cd tero
cp src/sample.env .env
```

Nota: si usas `git-lfs`, instálalo antes de clonar para evitar archivos incompletos.

## 2) Configurar variables `.env`

- Opcion OpenAI:
  - `OPENAI_API_KEY=...`
- Opcion Anthropic (via AWS Bedrock):
  - `AWS_ACCESS_KEY_ID=...`
  - `AWS_SECRET_ACCESS_KEY=...`
  - `AWS_REGION=us-east-1`
  - `AWS_MODEL_ID_MAPPING=claude-sonnet-4:anthropic.claude-sonnet-4-20250514-v1:0`

Puedes partir del archivo `templates/tero-setup/.env.example`.

Si todavia no quieres pagar API:
- Deja `OPENAI_API_KEY` vacio por ahora.
- Avanza con todo el setup de infraestructura.
- Cuando quieras ejecutar agentes, pegas la key y reinicias servicios.

## 3) Parametros principales de navegacion (Browser Tool)

En `.env`:
- `BROWSER_TOOL_PLAYWRIGHT_MCP_URL=http://localhost:8931/mcp`
- `BROWSER_TOOL_PLAYWRIGHT_OUTPUT_DIR=var/playwright-output`

En `docker-compose.yml` (servicio `playwright`):
- `--headless`
- `--viewport-size=1280x720` (ajustable)
- `--allowed-hosts=playwright:8931,localhost:8931`

Si tu app bajo prueba usa otro dominio, agrega ese host en `--allowed-hosts`.

## 4) Levantar Tero

```bash
docker compose up -d
```

Accede a `http://localhost:8000` con `test / test`.

## 4.1) Flujo recomendado sin API key (preparacion completa)

1. Levanta stack:
   - `docker compose up -d postgres keycloak playwright app`
2. Verifica estado:
   - `docker compose ps`
3. Abre `http://localhost:8000` e ingresa con `test / test`.
4. Crea/importa el agente y deja listo el `.feature`.
5. Cuando decidas pagar, completa `OPENAI_API_KEY` y ejecuta:
   - `docker compose restart app`

## 5) Ejecutar Gherkin sin step definitions manuales

1. Importa el agente `es/qa-automation-gherkin-web`.
2. Habilita la herramienta `Browser`.
3. Pega el contenido de `es/qa-automation-gherkin-web/login.feature`.
4. Proporciona credenciales de prueba cuando el agente las solicite.

## 6) Hardening minimo de navegacion

Si tu app cambia de resolucion o se bloquea por host:
- Ajusta viewport en `docker-compose.yml` del servicio `playwright`:
  - `--viewport-size=1366x768` (o el que prefieras)
- Ajusta hosts permitidos:
  - `--allowed-hosts=playwright:8931,localhost:8931,prepagas-backoffice-testing.bqmtest.com.uy`
