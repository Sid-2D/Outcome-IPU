var path = require('path')
var webpack = require('webpack')

module.exports = {
	entry: './Resources/webpack.entry.js',
	output: {
		path: path.resolve(__dirname, 'Resources'),
		filename: 'webpack.bundle.js'
	},
	module: {
		rules: [
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015'],
				}
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: true })
	]
}