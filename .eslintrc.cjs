module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'standard-with-typescript'
      ],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname
      }
    }
  ],
  root: true
  // rules: {
  // }
}
