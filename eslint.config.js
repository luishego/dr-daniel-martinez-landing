import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/**', '.astro/**', 'node_modules/**']),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    files: ['**/*.{js,mjs,ts,astro}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    // Los archivos de configuración corren en Node.
    files: ['*.config.{js,mjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
);
