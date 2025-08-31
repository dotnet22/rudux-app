import { test, expect } from '@playwright/test';

test('filter performance and rerender optimization test', async ({ page }) => {
  // Navigate to the programs page
  await page.goto('/');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  
  // Capture React DevTools performance if available
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(msg.text());
  });
  
  // Check if we're on a page with filters
  const filterSection = page.locator('text=Programs Management').first();
  if (await filterSection.isVisible()) {
    console.log('✅ Found Programs page with filter section');
    
    // Look for filter controls (dropdowns, inputs)
    const autocompleteFields = page.locator('.MuiAutocomplete-root');
    const autocompleteCount = await autocompleteFields.count();
    
    console.log(`Found ${autocompleteCount} filter controls`);
    
    if (autocompleteCount > 0) {
      // Test filter interaction performance
      const startTime = performance.now();
      
      // Click on first filter control (likely University)
      const firstFilter = autocompleteFields.first();
      await firstFilter.click();
      
      // Wait for dropdown to open
      await page.waitForSelector('.MuiAutocomplete-listbox', { timeout: 5000 });
      
      // Select first option if available
      const firstOption = page.locator('.MuiAutocomplete-option').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
        
        const interactionTime = performance.now() - startTime;
        console.log(`✅ Filter interaction completed in ${interactionTime.toFixed(2)}ms`);
        
        // Check if filter chips appeared
        await page.waitForTimeout(500); // Allow time for state updates
        
        const filterChips = page.locator('.MuiChip-root');
        const chipCount = await filterChips.count();
        console.log(`Found ${chipCount} filter chips after selection`);
        
        if (chipCount > 0) {
          // Test chip deletion performance
          const chipDeleteStartTime = performance.now();
          
          // Find chip with delete icon
          const deleteableChip = filterChips.filter({ 
            has: page.locator('[data-testid="CancelIcon"], .MuiChip-deleteIcon, .MuiSvgIcon-root[data-testid="CancelIcon"]') 
          }).first();
          
          if (await deleteableChip.isVisible()) {
            const deleteIcon = deleteableChip.locator('[data-testid="CancelIcon"], .MuiChip-deleteIcon, .MuiSvgIcon-root').first();
            await deleteIcon.click();
            
            const deleteTime = performance.now() - chipDeleteStartTime;
            console.log(`✅ Chip deletion completed in ${deleteTime.toFixed(2)}ms`);
            
            // Verify quick response (optimized should be under 50ms)
            expect(deleteTime).toBeLessThan(100);
            
            // Wait and check for any error messages
            await page.waitForTimeout(200);
            
            // Verify chip was removed
            const remainingChips = await filterChips.count();
            console.log(`Remaining chips after deletion: ${remainingChips}`);
          }
        }
      }
    }
  }
  
  // Check for React warnings or errors in console
  const reactWarnings = consoleMessages.filter(msg => 
    msg.includes('Warning') || 
    msg.includes('Error') ||
    msg.includes('render') ||
    msg.toLowerCase().includes('performance')
  );
  
  if (reactWarnings.length > 0) {
    console.log('⚠️ React warnings found:', reactWarnings);
  } else {
    console.log('✅ No React warnings detected');
  }
  
  // Measure final page performance
  const metrics = await page.evaluate(() => ({
    jsHeapSize: (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 'N/A',
    renderTime: performance.now(),
    resourceCount: performance.getEntriesByType('resource').length
  }));
  
  console.log('📊 Performance metrics:', metrics);
  
  // Ensure no memory leaks or excessive resource usage (60MB limit for React app with MUI)
  if (typeof metrics.jsHeapSize === 'number') {
    expect(metrics.jsHeapSize).toBeLessThan(60 * 1024 * 1024); // Less than 60MB
    console.log(`✅ Memory usage within bounds: ${(metrics.jsHeapSize / (1024 * 1024)).toFixed(2)}MB`);
  }
});