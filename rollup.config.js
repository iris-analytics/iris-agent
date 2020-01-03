import { terser } from 'rollup-plugin-terser';
import sizes from 'rollup-plugin-sizes';
import html from 'rollup-plugin-bundle-html';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'Iris',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [sizes(), terser()],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [sizes()],
  },

  // Generate example html
  {
    input: 'src/index.js',
    output: {
      name: 'Iris',
      file: 'example/html/bundle.js',
      format: 'umd',
    },
    plugins: [
      sizes(),
      terser(),
      html({
        template: 'example/html/template.html',
        dest: 'example/html',
        filename: 'index.html',
        inject: 'head',
      }),
    ],
  },
];
