import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
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
      jsc: {
        target: 'es2021',
        parser: { syntax: 'typescript', decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
      },
    }),
  ],
});
