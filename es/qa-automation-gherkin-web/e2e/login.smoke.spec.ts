import { test, expect } from "@playwright/test";

const BASE = "https://prepagas-backoffice-testing.bqmtest.com.uy";

const POST_SIGN_IN_CAPTURE_MS = 5_000;

async function fillKeycloakForm(page: import("@playwright/test").Page, user: string, pass: string) {
  const userField = page.locator('input[name="username"], input#username').first();
  const passField = page.locator('input[name="password"], input#password').first();
  await userField.waitFor({ state: "visible", timeout: 45_000 });
  await userField.fill(user);
  await passField.fill(pass);
}

async function submitKeycloakSignIn(page: import("@playwright/test").Page) {
  const submit = page.getByRole("button", { name: /sign in/i });
  await submit.first().click();
}

async function fillKeycloakLogin(page: import("@playwright/test").Page, user: string, pass: string) {
  await fillKeycloakForm(page, user, pass);
  await submitKeycloakSignIn(page);
}

async function waitAtLeastMsSince(sinceMs: number, minMs: number) {
  const elapsed = Date.now() - sinceMs;
  const remaining = minMs - elapsed;
  if (remaining > 0) {
    await new Promise((r) => setTimeout(r, remaining));
  }
}

test.describe("login.feature (smoke)", () => {
  test("Login exitoso con credenciales validas", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await fillKeycloakForm(page, "admin", "admin");
    const signInClickedAt = Date.now();
    await submitKeycloakSignIn(page);

    await expect
      .poll(
        async () => {
          const url = page.url();
          const backOnApp =
            url.includes("prepagas-backoffice-testing.bqmtest.com.uy") &&
            !/\/realms\/.+\/login/i.test(url);
          const errVisible = await page.locator("#kc-error-message").isVisible().catch(() => false);
          return (backOnApp || !url.includes("/realms/")) && !errVisible;
        },
        { timeout: 60_000 },
      )
      .toBeTruthy();

    await waitAtLeastMsSince(signInClickedAt, POST_SIGN_IN_CAPTURE_MS);
  });

  test("Login rechazado con credenciales invalidas", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await fillKeycloakLogin(page, "admin", "clave-invalida-123");

    const error = page.locator("#kc-error-message, .alert-error, .pf-c-alert__title, span.kc-feedback-text").first();
    await expect(error).toBeVisible({ timeout: 30_000 });
  });
});
