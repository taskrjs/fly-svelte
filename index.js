const parse = require('path').parse;
const format = require('path').format;
const extname = require('path').extname;
const compile = require('svelte').compile;

const toArray = v => Array.isArray(v) ? v : [v];

module.exports = function (fly, utils) {
  fly.plugin('svelte', {every: false}, function * (files, opts) {
  	opts = opts || {};

  	if (opts.entry) {
  		files = toArray(opts.entry).map(parse);
  	}

  	const mapType = opts.sourceMap || false;

		let data, filename, result, out = [];

		for (let file of files) {
			filename = format(file);
			data = file.data || (yield utils.read(filename));
			result = compile(data.toString(), Object.assign({}, opts, { filename }));

			// write result to file data
			file.data = new Buffer(result.code);

			// ensure `file.base` is always a JS output
			file.base = file.base.replace(extname(file.base), '.js');

			// handle sourcemaps
			if (mapType === 'inline') {
				file.data += new Buffer(`\n//# sourceMappingURL=${result.map.toUrl()}`);
			} else if (mapType === 'external') {
				const mapFile = file.base + '.map';
				file.data += new Buffer(`\n//# sourceMappingURL=${mapFile}`);
				// push an external sourcemap to output
				out.push({
					base: mapFile,
					data: result.map.toString(),
					dir: file.dir
				});
			}

			// keep source
			out.push(file);
		}

		// force replace files
		this._.files = out;
  });
}
