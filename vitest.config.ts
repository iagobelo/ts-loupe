import { defineConfig } from 'vitest/config';

/**
 * Unit suite: runs against `src`. The artifact suite lives in `test/dist` and is
 * excluded here because it needs `npm run build` to have run first; it has its
 * own config so a missing build fails loudly instead of being skipped.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['test/dist/**'],
  },
});
