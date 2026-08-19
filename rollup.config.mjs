import terser from '@rollup/plugin-terser';

// The bundler only ever sees plain JavaScript already emitted by `tsc`, so it is
// fully decoupled from whichever TypeScript version the project compiles with.
const banner = `/*!
 * ts-loupe v${process.env.npm_package_version ?? ''}
 * (c) Iago Belo
 * Released under the MIT License.
 */`;

// The UMD global name is kept byte-for-byte identical to v0.x so that existing
// `<script src="...">` consumers reading `window['ts-loupe']` keep working.
const umd = (file, plugins = []) => ({
  file,
  format: 'umd',
  name: 'ts-loupe',
  exports: 'named',
  sourcemap: true,
  banner,
  plugins,
});

export default {
  input: 'dist/esm/index.js',
  output: [umd('dist/index.umd.js'), umd('dist/index.umd.min.js', [terser()])],
};
