const isDevelopment = process.env.NODE_ENV !== 'production'; // NODE_ENV is 'production' when running build
const BUILD_ERROR = isDevelopment ? 'warn' : 'error';

module.exports = {
  root: true,
  extends: [
    '@nuxt/eslint-config'
  ],
  plugins: [
    'unused-imports',
    'unicorn'
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': [
      'warn',
      {
        'ts-ignore': 'allow-with-description',
        'minimumDescriptionLength': 3
      }
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/consistent-type-definitions': [ 'error', 'type' ],
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        'vars': 'all',
        'varsIgnorePattern': '^_|^props',
        'args': 'after-used',
        'argsIgnorePattern': '^_'
      }
    ],
    'vue/no-template-shadow': 'off',
    'vue/max-attributes-per-line': ['error', {
      'singleline': {
        'max': 1
      },
      'multiline': {
        'max': 1
      }
    }],
    'vue/valid-v-slot': 'off',
    'vue/no-useless-template-attributes': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        'registeredComponentsOnly': false,
        'ignores': []
      }
    ],
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'max-lines': [
      'warn',
      {
        'max': 600,
        'skipBlankLines': true,
        'skipComments': true
      }
    ],
    'max-depth': ['warn', 4],
    'unicorn/expiring-todo-comments': [
      'error',
      {
        'allowWarningComments': false
      }
    ],
    'unicorn/prefer-export-from': 'error',
    'no-console': [
      BUILD_ERROR,
      {
        allow: [ 'info', 'warn', 'error' ]
      }
  ],
    'no-debugger': BUILD_ERROR
  }
};
