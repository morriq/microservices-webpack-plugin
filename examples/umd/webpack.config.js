const { resolve } = require('path');

const MicroservicesWebpackPlugin = require('./../../lib/index.js');


module.exports = {
	entry: resolve(__dirname, 'src', 'index.js'),
	output: {
		path: resolve(__dirname, 'dist'),
		libraryTarget: 'amd'
	},
	plugins: [
		new MicroservicesWebpackPlugin({
      modules: [
        { name: 'react', path: `umd/react.production.min.js` },
      ]
    })
	]
};
