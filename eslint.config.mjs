import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'type:core',
              onlyDependOnLibsWithTags: ['type:core'],
            },
            {
              sourceTag: 'type:http',
              onlyDependOnLibsWithTags: ['type:core', 'type:http'],
            },
            {
              sourceTag: 'type:auth',
              onlyDependOnLibsWithTags: ['type:core', 'type:http', 'type:auth'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: [
                'type:core',
                'type:http',
                'type:auth',
                'type:ui',
              ],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
