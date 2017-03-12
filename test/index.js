const join = require('path').join;
const test = require('tape');
const Fly = require('fly');

const dir = join(__dirname, 'fixtures');
const tmp = join(__dirname, '.tmp');

test('fly-svelte', (t) => {
	t.plan(7);

  const fly = new Fly({
  	plugins: [
  		require('../'),
  		require('fly-clear')
  	],
  	tasks: {
  		*a(f) {
  			yield f.source(`${dir}/*.html`).svelte().target(tmp);
  			const arr = yield f.$.expand(`${tmp}/*.js`);
  			t.equal(arr.length, 2, 'creates multiple JS files');
  			const str = yield f.$.read(`${tmp}/foo.js`, 'utf8');
  			t.true(/export default/.test(str), 'exports as `es` module by default');
  			yield f.clear(tmp);
  		},
  		*b(f) {
  			yield f.source(`${dir}/*.html`).svelte({ entry: `${dir}/foo.html` }).target(tmp);
  			const arr = yield f.$.expand(`${tmp}/*.js`);
  			t.equal(arr.length, 1, 'overrides `fly.source` with `options.entry`, if given');
  			yield f.clear(tmp);
  		},
  		*c(f) {
  			yield f.source(`${dir}/*.html`).svelte({ sourceMap: 'inline' }).target(tmp);
  			const str = yield f.$.read(`${tmp}/foo.js`, 'utf8');
  			t.true(/sourceMappingURL=data:application/.test(str), 'attach an `inline` sourceMap');
  			yield f.clear(tmp);
  		},
  		*d(f) {
  			yield f.source(`${dir}/*.html`).svelte({ sourceMap: 'external' }).target(tmp);
  			const arr = yield f.$.expand(`${tmp}/*`);
  			t.equal(arr.length, 4, 'creates four files (2 `.js` + 2 `.js.map`');
  			const str = yield f.$.read(`${tmp}/foo.js`, 'utf8');
  			t.true(/sourceMappingURL=foo.js.map/.test(str), 'attach an `external` sourceMap link');
  			yield f.clear(tmp);
  		}
  	}
  });

  t.ok('svelte' in fly.plugins, 'add the `svelte` plugin');

  fly.serial(['a', 'b', 'c', 'd']);
});
