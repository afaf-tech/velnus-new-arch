module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin'],
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    createDefaultProgram: true,
  },
  extends: [
    'plugin:import/recommended',
    'eslint:recommended',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'prettier/prettier': 2,
    'no-console': 2,
    'import/prefer-default-export': 0,
    // TODO: Move all to new method, caouse use no-cyle is not god for memory server
    'import/no-cycle': 0,
    'import/no-named-as-default': 0, // alow use export * and named as default
    'no-param-reassign': 0,
    'no-tabs': [2, { allowIndentationTabs: true }],
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0, // allow use any in types
    '@typescript-eslint/ban-types': 0, // allow write types like object, dll
    'class-methods-use-this': 0,
  },
  overrides: [
    {
      files: ['./src/main.ts', './src/console.ts'],
      rules: {
        '@typescript-eslint/no-floating-promises': 0,
      },
    },
    {
      files: [
        './src/**/*.dto.ts',
        './src/**/*.schemas.ts',
        './src/**/*.controller.ts',
        './src/schemas/*',
      ],
      rules: {
        'max-classes-per-file': 0,
      },
    },
    {
      files: ['./src/database/migrations/*'],
      rules: {
        '@typescript-eslint/naming-convention': 0,
        'class-methods-use-this': 0,
      },
    },
  ],
};
