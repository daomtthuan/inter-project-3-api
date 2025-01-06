import js from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import prettierConfig from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import ts from 'typescript-eslint';

/** ESLint configs. */
export const configs = ts.config(
  // env configs
  {
    ignores: ['node_modules/**/*', 'dist/**/*'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // js configs
  js.configs.recommended,

  // ts configs
  ...ts.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'with-single-extends',
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // jsdoc configs
  {
    ...jsdoc.configs['flat/recommended'],
    files: ['**/*.js', '**/*.jsx'],
  },
  {
    ...jsdoc.configs['flat/recommended-typescript'],
    files: ['**/*.ts', '**/*.tsx'],
  },
  {
    plugins: {
      jsdoc,
    },
    rules: {
      'jsdoc/tag-lines': [
        'warn',
        'always',
        {
          count: 0,
          startLines: 1,
        },
      ],
      'jsdoc/require-param': [
        'off',
        {
          checkDestructured: false,
        },
      ],
      'jsdoc/require-returns': [
        'error',
        {
          contexts: ['FunctionDeclaration', 'FunctionExpression'],
        },
      ],
      'jsdoc/check-param-names': [
        'off',
        {
          checkDestructured: false,
        },
      ],
    },
  },

  // prettier configs
  prettierConfig,
);

export default configs;
