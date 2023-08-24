module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
    '@typescript-eslint/prefer-for-of': 'warn',
    'prefer-const': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
  },
};
