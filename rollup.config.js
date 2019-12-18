import typescript from 'rollup-plugin-typescript2';

const isProduction = process.env.NODE_ENV === 'production';
const entryName = 'aurelia-validation';

export default [{
  input: `src/${entryName}.ts`,
  output: [
    {
      file: `dist/es2015/${entryName}.js`,
      format: 'es'
    },
    {
      file: `dist/umd-es2015/${entryName}.js`,
      format: 'umd',
      name: 'au.validation',
      globals: {
        'aurelia-binding': 'au',
        'aurelia-templating': 'au',
        'aurelia-dependency-injection': "au",
        "aurelia-logging": "au.LogManager",
        "aurelia-pal": "au",
        "aurelia-task-queue": "au",
      }
    }
  ],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          module: 'es2015',
          target: 'es2015',
          declaration: false
        },
        include: ['src'],
        exclude: undefined
      },
      cacheRoot: '.rollupcache'
    })
  ]
}].concat(!isProduction
  ? []
  : [
    {
      input: `src/${entryName}.ts`,
      output: {
        file: `dist/es2017/${entryName}.js`,
        format: 'es',
      },
      plugins: [
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              module: 'es2015',
              target: 'es2017',
              declaration: false
            },
            include: ['src'],
            exclude: undefined
          },
          cacheRoot: '.rollupcache'
        })
      ]
    },
    {
      input: `src/${entryName}.ts`,
      output: [
        { file: `dist/commonjs/${entryName}.js`, format: 'cjs' },
        { file: `dist/amd/${entryName}.js`, format: 'amd', amd: { id: entryName } },
        { file: `dist/native-modules/${entryName}.js`, format: 'es' },
        { file: `dist/umd/${entryName}.js`,
          format: 'umd',
          name: 'au.validation',
          globals: {
            'aurelia-binding': 'au',
            'aurelia-templating': 'au',
            'aurelia-dependency-injection': "au",
            "aurelia-logging": "au.LogManager",
            "aurelia-pal": "au",
            "aurelia-task-queue": "au",
          }
        },
        { file: `dist/system/${entryName}.js`, format: 'system' }
      ],
      plugins: [
        typescript({
          // tsconfigDefaults: defaultCfg,
          // tsconfig: undefined,
          tsconfigOverride: {
            compilerOptions: {
              module: 'es2015',
              target: 'es5',
              declaration: false
            },
            include: ['src'],
            exclude: undefined
          },
          cacheRoot: '.rollupcache',
        })
      ]
    }
  ]
);
