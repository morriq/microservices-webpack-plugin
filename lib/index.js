const { join } = require('path');
const { RawSource } = require('webpack-sources');

class MicroservicesWebpackPlugin {
	constructor(config = {}) {
		this.modules = config.modules || [];
		this.url = config.url || 'https://unpkg.com/:name@:version/:path';
		this.paramsRegex = /:([a-z]+)/gi;
		this.node_modules = join(process.cwd(), 'node_modules');

		this.modules = this.modules
			.map(({ name, ...other }) => ({
				name,
				...other,
				version: require(join(this.node_modules, name, 'package.json')).version
			}))
			.map(({ name, version, path }) => {
				if (!path.includes('.js')) {
					throw new Error(`Unsupported extension in ${path}`);
				}

				const cdn = this.url.replace(this.paramsRegex, (_, type) => ({
					name,
					version,
					path
				})[type]);

				return {
					name,
					cdn
				}
			})
	}

	apply(compiler) {
		compiler.hooks.emit.tapAsync(MicroservicesWebpackPlugin.name, this.tapAsync.bind(this))
    	compiler.options.externals = this.modules.map(({ name }) => name)
	}

	tapAsync(compilation, callback) {
		compilation.assets = Object.keys(compilation.assets)
			.map((fileName) => {
				if (!fileName.includes('.js')) {
					return {[fileName]: compilation.assets[fileName]};
				}

				const value = [
					this.modules
						.map(({ cdn, name }) => `define('${name}', ['${cdn}'], function(v) {return v;})`)
						.join('\n'),
					compilation.assets[fileName].source()
				].join('\n');

				return {[fileName]: new RawSource(value)};
			})
			.reduce((previous, current) => ({ ...previous, ...current }), {});

		callback()
	}
}

module.exports = MicroservicesWebpackPlugin;
