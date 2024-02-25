module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  plugins: ['solid'],
  extends: ['standard', 'eslint:recommended', 'plugin:solid/recommended'],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
