module.exports = {
  extends: ['airbnb-base', 'plugin:vue/recommended'],
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
    'linebreak-style': 'off',
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
    'import/no-dynamic-require': 'off',
    'vue/script-indent': ["error", 2, { "baseIndent": 1 }]
  },
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        "indent": "off"
      }
    }
  ],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 2017,
  },
};
