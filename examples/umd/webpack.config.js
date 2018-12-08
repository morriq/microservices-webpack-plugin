const { resolve } = require('path')
const MicroservicesWebpackPlugin = require('../../index.js')

module.exports = {
	entry: resolve(__dirname, 'index.js'),
	externals: {
		react: 'react'
	},
	output: {
		path: resolve(__dirname, 'dist'),
		libraryTarget: 'amd'
	},
	plugins: [
		new MicroservicesWebpackPlugin([
			{ name: 'react', path: `umd/react.production.min.js` },
		])
	]
}
