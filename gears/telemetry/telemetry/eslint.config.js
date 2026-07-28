import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const TS = ['**/*.ts'];
const TESTS = ['**/*.test.ts'];
const NODE_FILES = ['vite.config.ts', 'vitest.global-setup.ts'];

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  prettier,
  js.configs.recommended,
  stylistic.configs.recommended,
  {
    name: 'telemetry/base',
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
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }], // prefer single quotes
      'no-console': 'off',
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
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: false, // allow: const bar = array[0]
            object: true, // disallow: const bar = array.bar
          },
          AssignmentExpression: {
            array: false, // allow: bar = array[0]
            object: false, // allow: bar = array.bar
          },
        },
        { enforceForRenamedProperties: false }, // allow bar = foo.baz
      ],
      'prefer-template': ['error'], // forbid bar + 'a'. allow `${bar}a`
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }], // forbid new RegExp("abc")
    },
  },
  {
    name: 'telemetry/typescript',
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
      '@typescript-eslint/await-thenable': 'off', // intentionally allow `await` on values that may not always be thenables
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-duplicate-type-constituents': 'off', // allow A | B when A and B are the same type, for documentation purposes
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      'no-undef': 'off', // the type checker covers this
      'no-redeclare': 'off', // allow typescript overload
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error', // this is wrong: foo! ?? bar
      '@typescript-eslint/method-signature-style': 'error', // { a: () => void } instead of { a(): void }
      '@typescript-eslint/prefer-includes': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        {
          ignoreConditionalTests: true,
          ignoreMixedLogicalExpressions: true,
          ignorePrimitives: { string: true, number: true, bigint: true, boolean: true },
        },
      ],
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
          format: ['camelCase'],
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
      '@typescript-eslint/no-explicit-any': [
        'error', // must use unknown but not any
        { ignoreRestArgs: true }, // allow <T extends (...args: any[]) => boolean>
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'separate-type-imports', prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': ['error'],
      'no-unused-vars': 'off', // use @typescript-eslint/no-unused-vars
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/array-type': ['error', { default: 'array' }], // allowed: T[]
    },
  },
  {
    name: 'telemetry/node-tooling',
    files: NODE_FILES,
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    name: 'telemetry/tests',
    files: TESTS,
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off', // allow expect(true).to.be.true
    },
  },
  {
    name: 'telemetry/config-files',
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: globals.node,
    },
  },
);
