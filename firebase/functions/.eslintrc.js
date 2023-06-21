/* eslint-env node */
module.exports = {
  extends: [
    'standard'
  ],
  ignorePatterns: [
    '/lib/**/*' // Ignore built files.
  ],
  overrides: [
    {
      files: '*.ts',
      extends: [
        'standard-with-typescript'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json']
      // sourceType: "module",
      },
      plugins: [
        '@typescript-eslint',
        'import'
      ]
    }]
}
