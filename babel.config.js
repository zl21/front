const presets = [
  [
    '@babel/env',
    {
      targets: {
        chrome: '57'
      }
    }
  ]
];

const plugins = ['@babel/plugin-syntax-dynamic-import'];

module.exports = { presets, plugins };
