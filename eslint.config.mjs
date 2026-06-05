import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextVitals,
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off'
    }
  },
  {
    ignores: ['.next/**', 'node_modules/**', '.tools/**', '.pnpm-store/**']
  }
];

export default eslintConfig;
