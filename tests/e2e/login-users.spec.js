import { expect, test } from '@playwright/test';

test('login e gerenciamento de usuários', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('E-mail').fill('ana.souza@demo.local');
  await page.getByLabel('Senha').fill('senha-demonstracao');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('heading', { name: /Bom dia,/ })).toBeVisible();

  await page.getByRole('button', { name: /Usuários/ }).click();
  await expect(page.getByRole('heading', { name: 'Usuários' })).toBeVisible();
  await expect(page.locator('.user-table').getByText('Ana Souza', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Adicionar usuário' }).click();
  const uniqueSuffix = Date.now();
  const newUserName = `Marina Oliveira ${uniqueSuffix}`;
  await page.getByLabel('Nome completo').fill(newUserName);
  await page.getByLabel('E-mail', { exact: true }).fill(`marina.${uniqueSuffix}@demo.local`);
  await page.getByLabel('Perfil de acesso').selectOption('Analista');
  await page.getByRole('button', { name: 'Criar convite' }).click();
  await expect(page.getByText(newUserName)).toBeVisible();

  await page.getByRole('button', { name: 'Dados eleitorais' }).click();
  await expect(page.getByRole('heading', { name: 'Votos válidos e diferença' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Votos válidos por estado' })).toBeVisible();
});
