import path from 'node:path';
import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  // Resolve the `@/*` path alias (from tsconfig) for the test run, so specs and
  // the src they import can use aliased paths instead of relative ones. A plain
  // alias avoids the ESM-only `vite-tsconfig-paths`, which can't be required by
  // this CommonJS-loaded config.
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.spec.ts', 'src/**/*.spec.ts'],
    testTimeout: 20000,
    // The e2e specs all run against one shared Postgres, so they must not run
    // concurrently — parallel suites interfere (one suite's data/teardown races
    // another's), surfacing as spurious 404s. Run spec files serially.
    fileParallelism: false,
  },
  plugins: [
    // NestJS DI relies on `emitDecoratorMetadata`, which vitest's default esbuild
    // transform does not produce. SWC emits the decorator metadata so constructor
    // params (ConfigService, PrismaService, …) resolve instead of injecting as
    // undefined.
    swc.vite({
      // Ignore the project `.swcrc` (used by the Nest build): it sets
      // `module.type: commonjs`, which would emit `require()` and break Vitest's
      // ESM transform pipeline. Tests get everything they need from the inline
      // config below, and Vite handles module format.
      swcrc: false,
      configFile: false,
      jsc: {
        target: 'es2021',
        parser: { syntax: 'typescript', decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
      },
    }),
  ],
});
