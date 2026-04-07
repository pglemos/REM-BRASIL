import { test, expect } from '@playwright/test';

test('homepage has correct title and login link', async ({ page }) => {
  await page.goto('/');
  
  // Verifica se o título da página está correto
  await expect(page).toHaveTitle(/REM OS/);
  
  // Verifica se o link de login está visível
  const loginLink = page.getByRole('link', { name: /Acesso Restrito/i });
  await expect(loginLink).toBeVisible();
});

test('login page renders correctly', async ({ page }) => {
  await page.goto('/login');
  
  // Verifica se o formulário de login está presente
  await expect(page.getByRole('heading', { name: /Acesso Restrito/i })).toBeVisible();
  await expect(page.getByPlaceholder(/seu@email.com/i)).toBeVisible();
  await expect(page.getByPlaceholder(/••••••••/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Entrar no Sistema/i })).toBeVisible();
});
