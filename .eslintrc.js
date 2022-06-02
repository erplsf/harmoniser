module.exports = {
  root: true,
  extends: [
    require.resolve('@gera2ld/plaid/eslint'),
    require.resolve('@gera2ld/plaid-common-react/eslint'),
  ],
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
    react: {
      pragma: 'VM',
    },
  },
  globals: {
    VM: true,
  },
  rules: {
    indent: ['error', 2, {SwitchCase: 1}],
    'operator-linebreak': 'off',
    'no-console': 'off',
  },
}
