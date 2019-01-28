module.exports = {
  extends: 'airbnb-base',
  plugins: ['vue'],
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack.config.js'
      }
    },
  },
  env: {
    browser: true,
    node: true
  },
  rules: {
    'import/no-cycle': 'off',
    'max-len': 'off',
    'radix': 'off',
    'no-plusplus': 'off',
    'prefer-destructuring': 'off',
    'global-require': 'off',
    'comma-dangle': 'off',
    'no-underscore-dangle': 'off',
    'guard-for-in': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'import/no-dynamic-require': 'off'
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8,
  },
};
