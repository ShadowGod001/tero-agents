# Informes archivados (Playwright)

Los directorios `playwright-report/` y `test-results/` se generan al ejecutar `npm test` y estan listados en `.gitignore` del folder `e2e/`, por eso muchos IDEs **no los muestran** en el arbol de archivos (archivos ignorados).

Para guardar una **copia persistente** visible y portable:

```bash
cd es/qa-automation-gherkin-web/e2e
npm test
npm run report:archive
```

Se crea una carpeta con fecha y hora bajo `informes-archivados/<marca-de-tiempo>/` con copia de ambos directorios. Abre el HTML con el navegador:

`informes-archivados/<marca-de-tiempo>/playwright-report/index.html`
