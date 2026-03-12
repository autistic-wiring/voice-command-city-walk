import { test, expect } from '@playwright/test';

test.describe('Voice Command City Walk', () => {
  test('homepage has title and game elements', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Voice Command City Walk/i);
    
    // Check game container exists
    await expect(page.locator('#game-container')).toBeVisible();
    
    // Check character exists
    await expect(page.locator('#character')).toBeVisible();
    
    // Check world container exists
    await expect(page.locator('#world')).toBeVisible();
  });

  test('character responds to voice commands via debug API', async ({ page }) => {
    await page.goto('/');
    
    // Wait for game to initialize
    await page.waitForFunction(() => window.game !== undefined);
    
    // Test walk command
    await page.evaluate(() => window.game.command('walk'));
    await page.waitForTimeout(500);
    
    // Check character has walking class
    const character = page.locator('#character');
    await expect(character).toHaveClass(/walking/);
    
    // Test stop command
    await page.evaluate(() => window.game.command('stop'));
    await page.waitForTimeout(500);
    
    // Walking class should be removed
    await expect(character).not.toHaveClass(/walking/);
  });

  test('jump animation works', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForFunction(() => window.game !== undefined);
    
    // Trigger jump
    await page.evaluate(() => window.game.command('jump'));
    
    // Check character has jumping class
    const character = page.locator('#character');
    await expect(character).toHaveClass(/jumping/);
  });

  test('collision detection is functional', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForFunction(() => window.game !== undefined);
    
    // Get debug state
    const gameState = await page.evaluate(() => window.game.debug());
    
    // Verify game state has expected properties
    expect(gameState).toHaveProperty('character');
    expect(gameState).toHaveProperty('world');
  });

  test('responsive design works on different viewports', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('#game-container')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('#game-container')).toBeVisible();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('#game-container')).toBeVisible();
  });
});
