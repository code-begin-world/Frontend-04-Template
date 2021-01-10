module.exports = {
  extends: 'eslint:recommended',
  rules: {
    // enable additional rules
    indent: ['error', 2],
    // 'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],

    // override default options for rules from base configurations
    'comma-dangle': ['error', 'always'],
    'no-cond-assign': ['error', 'always'],

    'no-console': 'error',
    'no-unused': 'off'
  }
};
