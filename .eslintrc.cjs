// Both rules, with type information (projectService), as recommended by the
// plugin README. `npm run lint` reports nothing on src/Carousel.jsx.
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['react-google-translate'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    projectService: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    'react-google-translate/no-conditional-text-nodes-with-siblings': 'error',
    'react-google-translate/no-return-text-nodes': 'error',
  },
};
