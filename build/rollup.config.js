import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default [
  {
    input: 'build/index.js',
    output: [
      {
        file: 'dist/aurelia.esm.js',
        format: 'es'
      },
      {
        file: 'dist/aurelia.umd.js',
        format: 'umd',
        name: 'au'
      }
    ],

    // external: externalLibs,
    plugins: [
      replace({
        FEATURE_NO_ES2015: true,
        FEATURE_NO_ES2016: true,
        // Need for Reflect metadata
        FEATURE_NO_ESNEXT: undefined,
        FEATURE_NO_IE: true,
        FEATURE_NO_UNPARSER: true,
        FEATURE_ROUTER: process.env.ROUTER === false ? undefined : true
      }),

      nodeResolve({
        // jsnext: true,
        // main: true
      }),

      commonjs({
        // ignoreGlobal: true
      })
    ]
  },
  {
    input: 'build/index.full.js',
    output: [
      {
        file: 'dist/aurelia_router.esm.js',
        format: 'es'
      },
      {
        file: 'example/aurelia_router.esm.js',
        format: 'es'
      },
      {
        file: 'dist/aurelia_router.umd.js',
        format: 'umd',
        name: 'au'
      },
      {
        file: 'example/aurelia_router.umd.js',
        format: 'umd',
        name: 'au'
      }
    ],

    // external: externalLibs,
    plugins: [
      replace({
        FEATURE_NO_ES2015: true,
        FEATURE_NO_ES2016: true,
        // Need for Reflect metadata
        FEATURE_NO_ESNEXT: undefined,
        FEATURE_NO_IE: true,
        FEATURE_NO_UNPARSER: true,
        FEATURE_ROUTER: process.env.ROUTER === false ? undefined : true
      }),

      nodeResolve({
        // jsnext: true,
        // main: true
      }),

      commonjs({
        // ignoreGlobal: true
      })
    ]
  },
  {
    input: 'build/index.no-loader.js',
    output: [
      {
        file: 'dist/aurelia_no_loader.es5.umd.js',
        format: 'umd',
        name: 'au'
      }
    ],

    // external: externalLibs,
    plugins: [

      nodeResolve({
        // jsnext: true,
        // main: true
      }),

      commonjs({
        // ignoreGlobal: true
      }),

      babel({
        presets: [
          [
            '@babel/preset-env',
            { loose: true }
          ]
        ]
      })
    ]
  },
  {
    input: 'build/index.no-loader.full.js',
    output: [
      {
        file: 'dist/aurelia_router_no_loader.es5.umd.js',
        format: 'umd',
        name: 'au'
      }
    ],

    // external: externalLibs,
    plugins: [
      nodeResolve({
        // jsnext: true,
        // main: true
      }),

      commonjs({
        // ignoreGlobal: true
      }),

      babel({
        presets: [
          [
            '@babel/preset-env',
            { loose: true }
          ]
        ]
      })
    ]
  },
].map(config => {
  const es6Mappings = {
    'aurelia-templating-binding': './node_modules/aurelia-templating-binding/dist/es2015/aurelia-templating-binding.js',
    'aurelia-route-recognizer': './node_modules/aurelia-route-recognizer/dist/es2015/aurelia-route-recognizer.js',
    'aurelia-loader': './node_modules/aurelia-loader/dist/es2015/aurelia-loader.js'
  }
  config.plugins.unshift({
    resolveId(importee) {
      return es6Mappings[importee] || null;
    }
  });
  config.onwarn = function(warning, warn) {
    // skip certain warnings
    if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
  
    if (warning.code === 'NON_EXISTENT_EXPORT') return;

    throw new Error(warning.message);
  };
  return config;
})
