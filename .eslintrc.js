module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    jest: true
  },
  rules: {
    'no-use-before-define': 'off',
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': 'off',
    'react/destructuring-assignment': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off'
  },
  globals: {
    requestAnimationFrame: () => {},
    fetch: false
  }
};
