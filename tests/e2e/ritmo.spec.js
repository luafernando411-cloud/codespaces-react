import { expect, test } from '@playwright/test';

test('fluxo principal do Ritmo', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('E-mail').fill('ana.souza@demo.local');
  await page.getByLabel('Senha').fill('senha-demonstracao');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('heading', { name: /Bom dia,/ })).toBeVisible();

  const incrementButton = page.getByRole('button', { name: 'Aumentar contador' });
  const decrementButton = page.getByRole('button', { name: 'Diminuir contador' });
  await incrementButton.click();
  await incrementButton.click();
  await decrementButton.click();
  await expect(page.locator('.quick-counter strong')).toHaveText('01');

  await page.getByRole('button', { name: 'Acionar a API' }).click();
  await expect(page.getByRole('status')).toContainText('Ação recebida');

  await page.getByRole('button', { name: /Usuários/ }).click();
  await expect(page.getByRole('heading', { name: 'Usuários' })).toBeVisible();
  const searchInput = page.getByPlaceholder('Buscar por nome, e-mail ou área');
  await searchInput.fill('Ana Souza');
  await expect(page.locator('.user-table').getByText('Ana Souza', { exact: true })).toBeVisible();
  await searchInput.fill('');
  await page.locator('.filter-control select').selectOption('Ativo');
  await expect(page.locator('.user-table tbody tr')).toHaveCount(3);
  await page.locator('.filter-control select').selectOption('Todos');

  await page.getByRole('button', { name: 'Adicionar usuário' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const newUserName = `Marina Teste ${Date.now()}`;
  await page.getByLabel('Nome completo').fill(newUserName);
  await page.getByLabel('E-mail', { exact: true }).fill(`marina.${Date.now()}@demo.local`);
  await page.getByLabel('Perfil de acesso').selectOption('Analista');
  await page.getByRole('button', { name: 'Criar convite' }).click();
  await expect(page.getByText(newUserName)).toBeVisible();

  await page.getByRole('button', { name: 'Dados eleitorais' }).click();
  await expect(page.getByRole('heading', { name: 'Votos válidos e diferença' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Votos válidos por estado' })).toBeVisible();
});