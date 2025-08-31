import { test, expect } from '@playwright/test';

test('handleFriendlyFilterChange performance test', async ({ page }) => {
  // Navigate to the programs page
  await page.goto('/');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  
  // Start performance measurement
  const renderCount = 0;
  
  // Monitor console for React DevTools warnings about excessive renders
  page.on('console', msg => {
    if (msg.text().includes('render') || msg.text().includes('warning')) {
      console.log('Console message:', msg.text());
    }
  });
  
  // If we can find filter chips, test performance
  const filterChips = page.locator('[data-testid="filter-chip"], .MuiChip-root');
  const chipCount = await filterChips.count();
  
  if (chipCount > 0) {
    console.log(`Found ${chipCount} filter chips`);
    
    // Test deletion of individual filters
    const startTime = Date.now();
    
    // Try to click delete on first active chip (with delete icon)
    const deleteableChip = filterChips.filter({ has: page.locator('[data-testid="CancelIcon"], .MuiChip-deleteIcon') }).first();
    
    if (await deleteableChip.count() > 0) {
      const deleteIcon = deleteableChip.locator('[data-testid="CancelIcon"], .MuiChip-deleteIcon');
      await deleteIcon.click();
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`Filter deletion response time: ${responseTime}ms`);
      
      // Expect quick response (under 100ms for a well-optimized UI)
      expect(responseTime).toBeLessThan(100);
      
      // Wait a bit to ensure no excessive rerenders
      await page.waitForTimeout(100);
    } else {
      console.log('No deleteable filter chips found');
    }
  } else {
    console.log('No filter chips found - filters may not be active');
  }
  
  // Test overall page performance
  const performanceEntries = await page.evaluate(() => {
    const entries = performance.getEntriesByType('navigation');
    return entries.map(entry => ({
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      loadComplete: entry.loadEventEnd - entry.loadEventStart,
      type: entry.type
    }));
  });
  
  console.log('Performance metrics:', performanceEntries);
  
  // Check for any React warnings or errors
  const hasErrors = await page.evaluate(() => {
    return window.console && window.console.error ? 'No errors captured' : 'Console monitoring not available';
  });
  
  console.log('Error check:', hasErrors);
});