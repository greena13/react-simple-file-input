import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import path from 'path';

export default {
  input: 'src/index.js',

  output: {
    format: 'cjs',
    file: process.env.NODE_ENV === 'production' ? 'cjs/react-simple-file-input.production.min.js' : 'cjs/react-simple-file-input.development.js',
    exports: 'named'
  },
  external: [ 'react', 'prop-types' ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),

    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }),

    (process.env.NODE_ENV === 'production' && uglify()),

  ]
};
