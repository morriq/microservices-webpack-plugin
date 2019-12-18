const { RawSource } = require('webpack-sources');
const npmCheck = require('npm-check');
const fromEntries = require('object.fromentries');


class MicroservicesWebpackPlugin {
	constructor(config = {}) {
		this.modules = config.modules || [];
		this.url = config.url || 'https://unpkg.com/:name@:version/:path';
		this.paramsRegex = /:([a-z]+)/gi;
	}

  async createUrlsToModules(modules) {
    const currentState = await npmCheck();

    const packages = currentState
      .get('packages')
      .reduce((list, { moduleName, ...others }) => list.set(moduleName, others), new Map());

    return modules
      .map(({ name, ...other }) => ({
        name,
        ...other,
        version: packages.get(name).installed
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
      });
  }

	apply(compiler) {
		compiler.hooks.emit.tapAsync(MicroservicesWebpackPlugin.name, this.tapAsync.bind(this))
    compiler.options.externals = this.modules.map(({ name }) => name)
	}

	async tapAsync(compilation, callback) {
    this.modules = await this.createUrlsToModules(this.modules);

		compilation.assets = fromEntries(Object.entries(compilation.assets)
      .map(([fileName, asset]) => {
        if (!fileName.includes('.js')) {
          return [fileName, asset];
        }

        const source = asset.source();
        const supportAmdOnly = 'define(';

        if (!source.startsWith(supportAmdOnly)) {
          return [fileName, asset];
        }

        const value = [
          this.modules
            .map(({ cdn, name }) => `define('${name}', ['${cdn}'], function(v) {return v;})`)
            .join('\n'),
          source
        ].join('\n');

        return [fileName, new RawSource(value)];
      }));

		callback()
	}
}

module.exports = MicroservicesWebpackPlugin;
