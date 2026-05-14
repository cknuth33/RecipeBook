const { test, expect } = require('@playwright/test');

test('home cook golden path: login → add → search → expand → edit → delete', async ({ page }) => 
{
  // Login
  await page.goto('/');
  await page.getByTestId('login-username').fill('admin');
  await page.getByTestId('login-password').fill('password123');
  await page.getByTestId('login-submit').click();

  await expect(page.getByTestId('current-user')).toHaveText('admin');
  await expect(page.getByTestId('recipe-count')).toHaveText('3 recipes saved');

  // Add a new recipe
  await page.getByTestId('add-recipe').click();
  await expect(page.getByTestId('modal-title')).toHaveText('add recipe');

  await page.getByTestId('f-name').fill('E2E Test Cookies');
  await page.getByTestId('f-category').selectOption('Dessert');
  await page.getByTestId('f-servings').fill('24');
  await page.getByTestId('f-ingredients').fill('2 cups flour\n1 cup sugar\n1 egg');
  await page.getByTestId('f-instructions').fill('Mix and bake at 375 for 10 minutes.');
  await page.getByTestId('modal-save').click();

  await expect(page.getByTestId('status-banner')).toHaveText('Recipe added.');
  await expect(page.getByTestId('recipe-count')).toHaveText('4 recipes saved');

  // Search narrows to the new recipe
  await page.getByTestId('search-input').fill('cookies');
  await expect(page.getByTestId('recipe-count')).toHaveText('1 recipe found');

  // Expand the card to reveal details
  const card = page.locator('[data-testid="recipe-card"]').filter({ hasText: 'E2E Test Cookies' });
  await card.locator('[data-testid="recipe-name"]').click();
  await expect(card.locator('[data-testid="recipe-body"]')).toHaveClass(/open/);

  // Edit: change servings from 24 to 12
  await card.locator('[data-testid="recipe-edit"]').click();
  await expect(page.getByTestId('modal-title')).toHaveText('edit recipe');
  await page.getByTestId('f-servings').fill('12');
  await page.getByTestId('modal-save').click();

  await expect(page.getByTestId('status-banner')).toHaveText('Recipe updated.');
  await expect(
    page.locator('[data-testid="recipe-card"]').filter({ hasText: 'E2E Test Cookies' })
  ).toContainText('12 servings');

  // Delete the recipe
  page.on('dialog', dialog => dialog.accept());
  await page.locator('[data-testid="recipe-card"]')
    .filter({ hasText: 'E2E Test Cookies' })
    .locator('[data-testid="recipe-delete"]')
    .click();

  // Clear search and confirm count is back to 3
  await page.getByTestId('search-input').fill('');
  await expect(page.getByTestId('recipe-count')).toHaveText('3 recipes saved');
  await expect(
    page.locator('[data-testid="recipe-card"]').filter({ hasText: 'E2E Test Cookies' })
  ).toHaveCount(0);
});
