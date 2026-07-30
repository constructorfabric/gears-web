import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const TS = ['**/*.ts', '**/*.tsx'];
const NODE_FILES = ['tsup.config.ts', 'vitest.config.ts'];

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  prettier,
  js.configs.recommended,
  stylistic.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  {
    name: 'ui-kit/base',
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-extra-semi': 'off', // use @stylistic/no-extra-semi
      'no-mixed-spaces-and-tabs': 'off', // use @stylistic/no-mixed-spaces-and-tabs
      'unused-imports/no-unused-imports': 'error', // remove unused imports
      '@stylistic/operator-linebreak': 'off', // conflicts with prettier
      '@stylistic/brace-style': 'off', // conflicts with prettier
      '@stylistic/no-trailing-spaces': 'off', // conflicts with prettier
      '@stylistic/semi-spacing': 'off', // conflicts with prettier
      '@stylistic/no-multiple-empty-lines': 'off', // conflicts with prettier
      '@stylistic/member-delimiter-style': 'off', // conflicts with prettier
      '@stylistic/arrow-parens': 'off', // conflicts with prettier
      '@stylistic/indent-binary-ops': 'off', // conflicts with prettier
      '@stylistic/yield-star-spacing': 'off', // conflicts with prettier
      '@stylistic/semi': 'off', // conflicts with prettier
      '@stylistic/quote-props': 'off', // conflicts with prettier
      '@stylistic/comma-dangle': 'off', // conflicts with prettier
      '@stylistic/indent': 'off', // conflicts with prettier
      '@stylistic/array-bracket-spacing': 'off', // conflicts with prettier
      '@stylistic/jsx-one-expression-per-line': 'off', // conflicts with prettier
      '@stylistic/jsx-wrap-multilines': 'off', // conflicts with prettier
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }], // prefer single quotes
      'no-console': 'error', // a component library must not log
      'no-debugger': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }], // prefer ===
      yoda: 'error', // forbid if (5 === x). allow if (x === 5)
      'no-unused-private-class-members': 'error',
      'no-constant-binary-expression': 'error', // forbid weird stuff like +x == null
      complexity: ['error'],
      'no-param-reassign': ['error'], // no function params reassign
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'no-constant-condition': ['error', { checkLoops: false }], // no if(true)
      'no-shadow': 'error', // no variables with same name from different scopes
      'prefer-const': 'error', // prefer const to let
      'object-shorthand': ['error', 'always'], // prefer { foo } to { foo: foo }
      'prefer-template': ['error'], // forbid bar + 'a'. allow `${bar}a`
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }], // forbid new RegExp("abc")
    },
  },
  {
    name: 'ui-kit/typescript',
    files: TS,
    extends: [...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-undef': 'off', // the type checker covers this
      'no-redeclare': 'off', // allow typescript overload
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error', // this is wrong: foo! ?? bar
      '@typescript-eslint/method-signature-style': 'error', // { a: () => void } instead of { a(): void }
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true, enforceForJSX: true },
      ],
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
      '@typescript-eslint/no-shadow': ['error'],
      'no-shadow': 'off', // use @typescript-eslint/no-shadow
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['variable', 'function'],
          format: ['camelCase', 'PascalCase'], // PascalCase for React components
        },
        {
          selector: ['variable'],
          modifiers: ['exported'],
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'], // allow more for exported
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error', // must use unknown but not any
    },
  },
  {
    name: 'ui-kit/node-files',
    files: NODE_FILES,
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    name: 'ui-kit/tests',
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off', // fine in tests
    },
  },
);
