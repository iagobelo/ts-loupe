# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-08-19

First release since 2021. It repairs a package that shipped without type declarations for five
years and fixes three ways the runtime could silently corrupt data.

### Fixed

- **Type declarations are published again.** `0.1.2` declared `"types": "types/index.d.ts"` but
  the tarball contained no `types/` directory, so every TypeScript consumer since August 2021
  resolved the package as `any` (`TS7016`). `0.1.0` and `0.1.1` had shipped declarations, making
  this a regression. The package now carries an explicit `files` allowlist and CI validates the
  real tarball with `publint` and `@arethetypeswrong/cli` on every run.
- **`prop` is type-safe in the form the README documented.** `prop<User>('age')` produced
  `Lens<User, string | number | …>` — the union of every property type — because TypeScript has no
  partial type-argument inference and `K` fell back to its `= keyof O` default. Writing a string
  into a numeric field compiled without error. That default is gone.
- **`compose` no longer discards lenses past the second.** With three lenses, `get` returned the
  intermediate object instead of the focused value and `set` overwrote the level it should have
  descended into, destroying its contents. `compose` now threads all of its arguments.
- **`compose` with one lens no longer throws.** It previously produced a lens that failed with
  `Cannot read properties of undefined` on first use.
- **`compose()` with no arguments fails immediately** with a descriptive `TypeError` instead of
  failing later at the call site.
- **`prop` on an array returns an array.** `prop(1).set(99)([10, 20, 30])` returned
  `{ '0': 10, '1': 99, '2': 30 }` — `Array.isArray` false, `length` undefined.
- **`prop` preserves the prototype.** Updating a class instance dropped its prototype, so the
  result failed `instanceof` and lost every method.
- **`prop` writing to `null` or `undefined` throws** instead of returning a fabricated object.
- **`prop` handles the `__proto__` key without losing the write.** The published `0.1.2` bundle
  transpiled the object spread down to `obj[key] = value`, which triggers the inherited
  `__proto__` setter and silently discarded the value. Writes are now defined as own properties.
  Neither version polluted `Object.prototype`.

### Added

- `compose` accepts one to seven lenses, typed so a broken chain is a compile error.
- An inferred form of `prop`: `prop('age')` resolves the object type where the lens is applied and
  needs no type arguments. The explicit `prop<User, 'age'>('age')` form remains for composition.
- Public type exports: `Lens`, `Getter`, `Setter`, `LensBuilder`, `LensProp`, `PropLens`,
  `LensCompose`, `LensSet`, `Focus`, `HasKey`.
- Dual ESM and CommonJS builds with declarations for both, resolved through `"exports"`.
- `sideEffects: false` for tree-shaking, and `engines.node`.
- A test suite that runs against the built ESM, CJS, UMD and minified UMD artifacts, including the
  browser global inside a `vm` sandbox. The previous suite only ever exercised `src`, which is a
  different program from what users install — the `__proto__` defect above existed only in the
  shipped bundle and was therefore invisible to it.
- Type-level tests compiled by `tsc`, so type regressions fail CI.
- GitHub Actions CI across Node 20, 22, 24 and 26 with lint, typecheck, type tests, unit tests,
  build, artifact tests and package validation, plus a compatibility job that installs the packed
  tarball on Node 18 and 20.
- Dependabot, grouping devDependency updates into a single pull request.

### Changed

- **Breaking:** `prop<User>('age')` no longer compiles. Use `prop('age')` or
  `prop<User, 'age'>('age')`. See the migration guide in the README.
- **Breaking:** the package is ESM-first (`"type": "module"`) and declares `"exports"`, so deep
  imports such as `ts-loupe/dist/index.js` are no longer reachable. CommonJS `require` is still
  supported through the `require` condition.
- `engines.node` is declared for the first time, as `>=18`. The dev toolchain itself needs Node
  20.19, but consumers only run the built output, so CI additionally installs the packed tarball
  on Node 18 and 20 and exercises it with nothing but Node.
- `unpkg` and `jsdelivr` now resolve to the minified UMD bundle. The bundle path
  (`dist/index.umd.js`) and the browser global name (`ts-loupe`) are unchanged, so existing
  `<script>` tags keep working.
- `keywords` describe the library instead of the boilerplate it was generated from, which had left
  the package unfindable by anyone searching for lenses or optics.
- The build no longer runs through Bili, whose last release was June 2020. `tsc` emits the
  JavaScript and the declarations; Rollup only bundles already-compiled JavaScript, so no bundler
  pins the TypeScript version.
- Toolchain replaced: Vitest for tests, oxlint plus Prettier for linting, TypeScript 7. The
  dependency tree went from 860 packages with 110 known vulnerabilities to 213 with none.

### Removed

- Travis CI. `travis-ci.org` was shut down in 2021; the badge had been reporting `unknown`.
- The `test:lint` script, whose glob expanded in `sh` to `src/*/*` and therefore checked only the
  test directory — none of the seven source files were ever linted, while the command reported
  success.
- Bili, Jest, ts-jest and the `typedoc.json` left over from the project template.

## [0.1.2] - 2021-08-13

### Changed

- Dependency bumps.

## [0.1.1] - 2021-05-18

### Changed

- Dependency bumps and formatting.

## [0.1.0] - 2020-09-24

- Initial release: `lens`, `view`, `set`, `over`, `prop` and `compose`.

[2.0.0]: https://github.com/iagobelo/ts-loupe/compare/v0.1.2...v2.0.0
[0.1.2]: https://github.com/iagobelo/ts-loupe/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/iagobelo/ts-loupe/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/iagobelo/ts-loupe/releases/tag/v0.1.0
