import { defineConfig } from 'vitest/config';

/**
 * Runs against the built artifacts in `dist/`, so it requires `npm run build`
 * first. Kept separate from the unit suite so a missing build fails loudly
 * instead of silently skipping.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/dist/**/*.test.ts'],
  },
});
