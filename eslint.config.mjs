// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/**
 * Single source of truth for linting across the monorepo.
 *
 * The shared base (JS + typescript-eslint recommended, with Prettier turning
 * off all stylistic rules) applies to every project. Per-project blocks layer
 * on the environment-specific bits: the web app gets React + browser globals,
 * the API and shared package get Node globals. ESLint resolves this config by
 * walking up from each package dir, so the per-package `lint` scripts all use
 * this one file.
 */
export default tseslint.config(
  // Never lint build output, deps, or generated code.
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/.vite/**',
      'apps/api/prisma/migrations/**',
    ],
  },

  // ---- Shared base: every TS/TSX file in every project ----
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      // Allow intentionally-unused args/vars when prefixed with `_`.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },

  // ---- Web app: React + browser ----
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: { ...globals.browser },
    },
    settings: { react: { version: 'detect' } },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // New JSX transform: no need to import React or have it in scope.
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      // We rely on TypeScript for prop typing rather than prop-types.
      'react/prop-types': 'off',
    },
  },

  // ---- API (NestJS) + shared package: Node ----
  {
    files: ['apps/api/**/*.ts', 'packages/shared/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // ---- Tooling / config files run in Node ----
  {
    files: ['**/*.config.{js,cjs,mjs,ts}', '**/*.{js,cjs,mjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Must come last: disables every rule that conflicts with Prettier.
  prettier,
);
