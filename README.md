# fly-svelte [![][travis-badge]][travis-link]

> Compile [Svelte](https://svelte.technology) components with Fly

## Install

```
npm install --save-dev fly-svelte
```

## Usage

```js
exports.views = function * (fly) {
  yield fly.source('src/**/*.html').svelte({
    entry: 'src/App.html',
    sourceMap: 'inline'
  }).target('dist/js');
}
```

If you wanted, you can chain other JavaScript plugins (eg [`fly-babel`](https://github.com/flyjs/fly-babel)) immediately after Svelte compiles!

```js
exports.scripts = function * (fly) {
  yield fly.source('src/App.html').svelte({
    css: false
  }).babel({
    presets: ['es2015']
  }).target('dist/js');
}
```


## API

By default, every file from `fly.source` will be treated as an `entry` file. (This can be changed via [`options.entry`](#optionsentry).) All source files will be compiled with `.js` file extensions.

### .svelte(options)

Check out Svelte's [CLI documentation](https://github.com/sveltejs/svelte#options) to see the available options.

This plugin adds **two additional** options:

#### options.entry

Type: `String` or `Array`<br>
Default: `null`

Use to specify entry file(s) from a larger source. Doing so will overwrite the the internal `fly.source` array. Useful when chaining multiple relevant tasks.

#### options.sourceMap

Type: `String`<br>
Options: `'internal'` or `'external'`
Default: `false`

Create an inline or an external sourcemap for each entry file. A `sourceMappingURL` comment is appended to each destination file.

> If using external maps, a `foo.js` entry will also generate a `foo.js.map` file.


## License

MIT © [Luke Edwards](http://github.com/lukeed)

[travis-link]:  https://travis-ci.org/lukeed/fly-svelte
[travis-badge]: http://img.shields.io/travis/lukeed/fly-svelte.svg?style=flat-square
